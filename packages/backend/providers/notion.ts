import { Client } from '@notionhq/client';
import request from 'request';

import { config } from '../helpers';

export enum NotionProviderReturnCode {
	GET_ACCESS_TOKEN_SUCCESS,
	GET_ACCESS_TOKEN_FAIL,
}

export async function getAccessTokenFromCode(code: string) {
	const authToken = Buffer.from(
		`${config().NOTION_OAUTH_ID}:${config().NOTION_OAUTH_SECRET}`,
	).toString('base64');

	let REDIRECT_URI = 'http://localhost:3000';
	if (process.env.NODE_ENV == 'production') {
		REDIRECT_URI = process.env.REDIRECT_URI || '';
	}

	const options = {
		url: 'https://api.notion.com/v1/oauth/token',
		headers: {
			'User-Agent': 'request',
			Authorization: `Basic ${authToken}`,
			'Content-Type': 'application/json',
		},
		json: {
			grant_type: 'authorization_code',
			code: code,
			redirect_uri: REDIRECT_URI + '/notion-redirect',
		},
	};

	return new Promise((resolve, reject) => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		request.post(options, (_error: any, _res: any, body: any) => {
			if (body.error) {
				reject(body.error);
			} else resolve(body);
		});
	});
}

export async function getAllSharedPagesOfUser(accessToken: string) {
	const notion = new Client({
		auth: accessToken,
	});
	const data = await notion.search({
		query: '',
		sort: {
			direction: 'descending',
			timestamp: 'last_edited_time',
		},
	});
	return data?.results || [];
}

export async function getPageChildren(accessToken: string, pageId: string) {
	const notion = new Client({
		auth: accessToken,
	});
	const data = await notion.blocks.children.list({
		block_id: pageId,
	});

	return data?.results || [];
}
