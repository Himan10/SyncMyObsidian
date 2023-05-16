#!/bin/node

function generateQueryForMultipleFiles() {
	let query = ""
	const fileNamePattern = new RegExp("\/[^\/]+$")
	const files = require("./modified_files.json")
	const filesLength = files.files.length
	if (filesLength < 1 || (filesLength == 1 && files.files[0] == "")) {
		return -1
	}
	files.files.forEach((element, index) => {
		element = element.replace(/'/g, "\\'")
		element = fileNamePattern.exec(element)[0].substr(1)
		// if last element then don't append the or operator in string
		query += `name='${element}'`
		if (index != filesLength-1) {
			query += ' or '
		}
	})
	query += ' and trashed=false'
	console.log(query)
	return query
}

function filesMetadataFromDrive(drive) {
	const query = generateQueryForMultipleFiles()
	if (query == -1) {
		return query
	}
	drive.files.list(
		{
			q: query,
			fields: 'nextPageToken, files(id, name, mimeType, createdTime)'
		},
		(error, response) => {
			if (error) {
				throw error;
			} else {
				const files = response.data.files;
				files.forEach((file) => {
					console.log(`${file.id}, ${file.name}`)
				})
			}
		}
	)
}


// google apis module import
const { google } = require("googleapis");

// Adding scopes
const scopes = [
	"https://www.googleapis.com/auth/drive"
]

// import the credentials from the file
const credentials = require("./credentials.json")

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

filesMetadataFromDrive(drive)
