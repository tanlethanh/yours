import http from 'http';

import { config } from '@yours/backend';
import {
	firebaseProvider,
	Handler,
	Middlewares,
	mongoDB,
} from '@yours/backend';
import express from 'express';
import morgan from 'morgan';

import { ApiRoute } from './routes';

const app = express();

app.use(morgan('tiny'));

mongoDB.connect();
mongoDB.initData();

firebaseProvider.initFirebaseApp();

Middlewares.mountCommonMiddleWares(app);

ApiRoute.mountRoute(app);

app.use('*', Handler.useNotFoundHandler);
app.use(Handler.errorHandler);

// const expressApp = new ExpressApp();
const server = http.createServer(app);

// Start the server on the specified port
const PORT = config().PORT;
server
	.listen(PORT, () => {
		return console.log(
			`⚡️[server]: Server is running at https://localhost:${PORT}`,
		);
	})
	.on('error', (_error: Error) => {
		return console.log('Error: ', _error.message);
	});
