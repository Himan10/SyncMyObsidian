#!/bin/node

// import the modules
const { google } = require("googleapis");
const fs = require("fs");
const os = require("os");
const mime = require("mime");

const logFilePath = os.userInfo().homedir + "/SyncMyObsidian/logs/index_file_logs"
const writeStream = fs.createWriteStream(logFilePath)

function generateQueryForMultipleFiles() {
        let query = ""
        let fileNames = [] // this list will contain the file name only excluding its path
        const fileNamePattern = new RegExp("\/[^\/]+$")
        const files = require("./logs/modified_files.json") // Get the Proper file path
        const filesLength = files.files.length
        if (filesLength < 1 || (filesLength == 1 && files.files[0] == "")) {
                return -1
        }
        files.files.forEach((element, index) => {
                element = element.replace(/'/g, "\\'")
                element = fileNamePattern.exec(element)[0].substr(1)
                fileNames.push(element)
                // if last element then don't append the or operator in string
                query += `name='${element}'`
                if (index != filesLength-1) {
                        query += ' or '
                }
        })
        query += ' and trashed=false'
        writeStream.write(`Query used to get the fileIds: ${query}\n`)
	return [query, files.files, fileNames]
}

async function uploadNewFiles(localFileNames, filesPaths) {

	const folderIdentifyPattern = RegExp("\/([^\/]+)\/[^\/]+$")
	let folderName = ""

	for (let index=0; index < filesPaths.length; index++) {
		const filePath = filesPaths[index]
		folderName = folderIdentifyPattern.exec(filePath)

		if (!folderName) {
			folderName = "Obsidian Vault"
		} else {
			folderName = folderName[1]
		}

		try {
			const response = await drive.files.list(
				{
					q: `name="${folderName}" and trashed=false`,
					fields: "nextPageToken, files(id)"
				}
			)
			const folderData = response.data.files

			// create a new file & update it
			await new Promise((resolve, reject) => {
				drive.files.create(
				{
					requestBody: {
						name: localFileNames[index],
						parents: [folderData[0].id]
					},
					media: {
						mimeType: mime.getType(filePath),
						body: fs.createReadStream(filePath)
					}
				}, 
				(error, response) => {
					reject(error)
					resolve(response)
				}
				)
			})
		} catch (error) {
			console.error(error)
		}
	}
}

async function uploadExistingFilesData(query, localFileNames, filesPaths) {
	// uplaod multiple files at one go
	
	try {
		const response = await drive.files.list(
			{
					q: query,
					fields: 'nextPageToken, files(id, name, mimeType, createdTime)'
			}
		)
		const files = response.data?.files
		files.forEach((file) => {   
			fileIndex = localFileNames.indexOf(file.name)
			try {
				const fileUpdateResponse = drive.files.update(
					{
						fileId: file.id,
						media: {
							mimeType: file.mimeType,
							body: fs.createReadStream(filesPaths[fileIndex])
						}
					}
				)
				writeStream.write(`File ${file.name} Uploaded Successfully`)
				localFileNames.splice(fileIndex, 1)
				filesPaths.splice(fileIndex, 1)
			} catch (fileUpdateError) {
				console.error(fileUpdateError)
			}
		})
	} catch (error) {
		console.error(error)
	}
}

async function filesDataFromDrive(drive) {
        // can be used to check if files are present on google drive or not
	// methods which are part of `drive` returns Promise; which means the later
	// part will execute if they method is still processing

        const [query, filesPaths, localFileNames] = generateQueryForMultipleFiles()
        if (query == -1) {
                return query
        }
	
	// upload files
	await uploadExistingFilesData(query, localFileNames, filesPaths)
	await uploadNewFiles(localFileNames, filesPaths)

    writeStream.end() // ending the writeStream
}

// Adding scopes
const scopes = [
        "https://www.googleapis.com/auth/drive"
]

// import the credentials from the file
const credentialsPath = os.userInfo().homedir + "/SyncMyObsidian/credentials.json"
const credentials = require(credentialsPath)

// set-up creds (create a JWT Token)
const JWTClient = new google.auth.JWT(
        credentials.client_email, null,
        credentials.private_key, scopes
)

JWTClient.authorize((err, tokens) => {
        if (err) {
                console.error(err);
                return;
        }
})

// Once the auth is set-up, get the drive
const drive = google.drive({version: 'v3', auth: JWTClient})

filesDataFromDrive(drive)

// listen for the finish event for writeStream
//writeStream.on("finish", () => {
//	console.log("Logs are written to logs/index_file_logs")
//})
