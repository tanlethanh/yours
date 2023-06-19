import http from 'http';

import {
	config,
	internalErrorHandler,
	mountCommonMiddleWares,
	notFoundHandler,
} from '@yours/backend';
import * as firebase from '@yours/backend/providers/firebase';
import * as mongoDB from '@yours/backend/providers/mongo';
import express from 'express';

import { mountRoute } from './routes';

const app = express();

mongoDB.connect();
mongoDB.initData();
firebase.initFirebaseApp();

mountCommonMiddleWares(app);
mountRoute(app);

app.use('*', notFoundHandler);
app.use(internalErrorHandler);

const server = http.createServer(app);

const PORT = config().PORT || 8266;
server
	.listen(PORT, () => {
		return console.log(
			`⚡️[server]: Server is running at https://localhost:${PORT}`,
		);
	})
	.on('error', (_error: Error) => {
		return console.log('Error: ', _error.message);
	});
