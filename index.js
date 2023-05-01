// google apis module import
const { google } = require("googleapis");

// import fs module
const fs = require("fs");

// import path module
const path = require("path");

// import the credentials from the file
const credentials = require("./.credentials.json")

// set-up creds
const CLIENT_ID = credentials.web.client_id
const CLIENT_SECRET = credentials.web_client_secret

// Set up the Redirect URI and refresh token
const REDIRECT_URI = credentials.web.redirect_uris[0]
const REFRESH_TOKEN = credentials.outhPlayground.refresh_token

// using the Oauth for authentication aur authorising the requests
const oauth2client = new google.auth.OAuth2(
	CLIENT_ID,
	CLIENT_SECRET,
	REDIRECT_URI
);

// setting our oauth credentials
oauth2client.setCredentials({ refresh_token: REFRESH_TOKEN });

// initialize the google drive API
const drive = google.drive({
	version: 'v3',
	auth: oauth2client,
});

console.log(oauth2client)
console.log(drive)
