
# Yours - learn your things
## Setup

### Install all needed packages
We are using yarn v3.5.0
```
yarn
```

### Database
You need to setup mongodb in your local machine for development stage

### Setup private file
In the root directory of project, make new directory has name **private**
Create new file has name **sipo-english-8266-firebase-adminsdk.json**
- This file contains all private information to use admin sdk of firebase.
- You can change how to store the file, but make sure you ignore it before push code to repo 

### Setup .env
You need to create **.env** file in root directory with following data
```
NODE_ENV='development'
USE_DEFAULT_USER="false"  // set to true if you want to use default user account (without auth in frontend)

// fill this field if USE_DEFAULT_USER is setted to **true**
DEFAULT_USER_EMAIL=""     
DEFAULT_USER_FIREBASE_UID=""

MAX_UPLOAD_LIMIT=2000
PORT=4040
MONGOOSE_URI='mongodb://127.0.0.1:27017/sipoenglish'

// Put notion token in following fields to contact with notion api
NOTION_TOKEN=''        
NOTION_OAUTH_ID=''      
NOTION_OAUTH_SECRET=''  

// Change the link to suite with you admin sdk file
FIREBASE_ADMIN_PATH='../../private/sipo-english-8266-firebase-adminsdk.json' 
```

## Booting the project
Run project
```
yarn dev
```
You can detach debugger in vscode with my config

