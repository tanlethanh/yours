import { Application } from "express";
import * as path from "path";
import * as dotenv from "dotenv";
import * as url from "url";

const __filename = url.fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

dotenv.config();

class Locals {
    /**
     * Makes env configs available for your app
     * throughout the app's runtime
     */
    public static config(): any {
        // const __dirname = url.fileURLToPath(new URL('.', import.meta.url))
        dotenv.config({ path: path.join(__dirname, "../../.env") });

        return {
            NODE_ENV: process.env.NODE_ENV,
            USE_DEFAULT_USER: process.env.USE_DEFAULT_USER == "true",
            DEFAULT_USER_EMAIL: process.env.DEFAULT_USER_EMAIL,
            DEFAULT_USER_FIREBASE_UID: process.env.DEFAULT_USER_FIREBASE_UID,
            PORT: process.env.PORT,
            MAX_UPLOAD_LIMIT: process.env.MAX_UPLOAD_LIMIT,
            NOTION_OAUTH_ID: process.env.NOTION_OAUTH_ID,
            NOTION_OAUTH_SECRET: process.env.NOTION_OAUTH_SECRET,
            NOTION_TOKEN: process.env.NOTION_TOKEN,
            MONGOOSE_URI: process.env.MONGOOSE_URI,
            FIREBASE_ADMIN_PATH: process.env.FIREBASE_ADMIN_PATH,
        };
    }

    /**
     * Injects your config to the app's locals
     */
    public static mountEnvConfig(_express: Application): Application {
        _express.locals.app = this.config();
        return _express;
    }
}

export { Locals };
