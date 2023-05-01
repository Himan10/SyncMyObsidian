files=()
logFilePath="/home/hi-man/GoogleDriveAPI/ObsidianServiceLogs"

function compareTwoDates() {
	ObsidianStartingDate=$(head -n 1 $logFilePath)

	# convert the file modification date & ObsidianStartingDate in epoch
	epochObsDate=$(date -d "$ObsidianStartingDate" +"%s")
	epochObsDate=$(expr $epochObsDate)

	filename=$(echo $1 | cut -d ' ' -f 2-)
	if [ -d "$filename" ]; then
		return
	fi

	fileModificationEpoch=$(echo $1 | cut -d ' ' -f 1)
	fileModificationEpoch=$(expr $fileModificationEpoch)

	if [ $fileModificationEpoch -gt $epochObsDate ]; then
		files+=("$filename")
		printf "%q\n" "$filename" >> ObsidianServiceLogs
	fi
}

function findModifyTime() {
	# -prune flag avoids the directory matched with ".*"
	# -o flag is used to evalute the later expression only if the preceeding one fails
	#export -f compareTwoDates
	#export logFilePath
	find /home/hi-man/Documents/Obsidian\ Vault -type d -name ".*" -prune -o -exec stat --format="%Y %n" {} \; | while read -r line
	do 
		compareTwoDates "$line"
	done

	# Add the file contents into an array; start reading file from 5th file
	while read -r line; do
		files+=("$line")
	done < <(sed '1,4d' ./ObsidianServiceLogs)

	# create a JSON array from the bash array of strings
	jsonarray=$(printf "%s\n" "${files[@]}" | jq -R . | jq -s .)

	# create a json object now
	json_object=$(jq -n --argjson files "${jsonarray}" '{ "files": $files }')

	(echo $json_object | json_pp) >> json_object
}

function createLogs() {
	# reduce the file size to 0
	truncate -s 0 "$logFilePath"

	# append the date/time when the app. starts to this file.
	date -d now >> "$logFilePath"

	# after this, only the modified files will take a place here
	echo -e "\nModified Files after the above timestamp : \n" >> "$logFilePath"
}

# provide the function name as a sys. arg

if [ -n "$1" ]; then
	"$1"
else
	findModifyTime
fi
