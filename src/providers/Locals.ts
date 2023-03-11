import { Application } from "express";
import * as path from "path";
import * as dotenv from "dotenv";
dotenv.config();
class Locals {
    /**
     * Makes env configs available for your app
     * throughout the app's runtime
     */
    public static config(): any {
        dotenv.config({ path: path.join(__dirname, "../../.env") });

        return {
            NODE_ENV: process.env.NODE_ENV,
            DEFAULT_USER_FOR_DEVELOPMENT:
                process.env.DEFAULT_USER_FOR_DEVELOPMENT,
            PORT: process.env.PORT,
            MAX_UPLOAD_LIMIT: process.env.MAX_UPLOAD_LIMIT,
            NOTION_OAUTH_ID: process.env.NOTION_OAUTH_ID,
            NOTION_OAUTH_SECRET: process.env.NOTION_OAUTH_SECRET,
            NOTION_TOKEN: process.env.NOTION_TOKEN,
            MONGOOSE_URI: process.env.MONGOOSE_URI,
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

export default Locals;
