import request from "request";
import { log, LogTitle } from "@yourenglish/backend/helpers";
import { Locals } from "@yourenglish/configs/locals.js";
import { Client } from "@notionhq/client";

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
                if (body.error) {
                    log.consoleLog(this.LOG_PREFIX, LogTitle.ERROR, body.error);
                    reject(body.error);
                } else resolve(body);
            });
        });
    }

    async getAllSharedPagesOfUser(accessToken: string) {
        const notion = new Client({
            auth: accessToken,
        });
        const data = await notion.search({
            query: "",
            sort: {
                direction: "descending",
                timestamp: "last_edited_time",
            },
        });
        return data?.results;
    }

    async getPageChildren(accessToken: string, pageId: string) {
        const notion = new Client({
            auth: accessToken,
        });
        const data = await notion.blocks.children.list({
            block_id: pageId,
        });

        return data?.results;
    }
}

export default new NotionProvider();
