import request from "request";
import Log, { LogTitle } from "../helpers/Log";
import Locals from "./Locals";

export enum NotionProviderReturnCode {
    GET_ACCESS_TOKE_SUCCESS,
    GET_ACCESS_TOKEN_FAIL,
}

class NotionProvider {
    LOG_PREFIX = "NOTION PROVIDER";

    async getAccessTokenFromCode(code: string) {
        const authToken = Buffer.from(
            `${Locals.config().NOTION_OAUTH_ID}:${
                Locals.config().NOTION_OAUTH_SECRET
            }`
        ).toString("base64");

        const options = {
            url: "https://api.notion.com/v1/oauth/token",
            headers: {
                "User-Agent": "request",
                Authorization: `Basic ${authToken}`,
                "Content-Type": "application/json",
            },
            json: {
                grant_type: "authorization_code",
                code: code,
                redirect_uri: "http://localhost:3000/notion-redirect",
            },
        };

        return new Promise((resolve, reject) => {
            request.post(options, (error: any, res: any, body: any) => {
                if (error) {
                    Log.consoleLog(this.LOG_PREFIX, LogTitle.ERROR, error);
                    reject(error);
                } else resolve(body);
            });
        });
    }
}

export default new NotionProvider();
