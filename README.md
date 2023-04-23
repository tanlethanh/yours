<<<<<<< HEAD

# Welcome to Sipo API
## Setup

### Install all needed packages
```
npm install
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
npm run dev
```
You can detach debugger in vscode with my config

=======
# Next.js + Tailwind CSS Example

This example shows how to use [Tailwind CSS](https://tailwindcss.com/) [(v3.2)](https://tailwindcss.com/blog/tailwindcss-v3-2) with Next.js. It follows the steps outlined in the official [Tailwind docs](https://tailwindcss.com/docs/guides/nextjs).

## Deploy your own

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=next-example) or preview live with [StackBlitz](https://stackblitz.com/github/vercel/next.js/tree/canary/examples/with-tailwindcss)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/vercel/next.js/tree/canary/examples/with-tailwindcss&project-name=with-tailwindcss&repository-name=with-tailwindcss)

## How to use

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [npm](https://docs.npmjs.com/cli/init), [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/), or [pnpm](https://pnpm.io) to bootstrap the example:

```bash
npx create-next-app --example with-tailwindcss with-tailwindcss-app
```

```bash
yarn create next-app --example with-tailwindcss with-tailwindcss-app
```

```bash
pnpm create next-app --example with-tailwindcss with-tailwindcss-app
```

Deploy it to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=next-example) ([Documentation](https://nextjs.org/docs/deployment)).


Hoang toi choi
>>>>>>> web/main
