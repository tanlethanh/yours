import { Middlewares } from '@yours/backend';
import { Handler } from '@yours/backend';
import express, { Router } from 'express';

import NotionController from '../../controllers/NotionController';
import TestsController from '../../controllers/TestsController';
import UsersController from '../../controllers/UsersController';

const apiV1: Router = express.Router();

const wrapper = Handler.errorHandlerWrapper;

/**
 * notion api
 * */
apiV1
	.route('/notion/auth')
	.post(Middlewares.userFilter, wrapper(NotionController.postAuthCode));

apiV1
	.route('/notion/data/sync')
	.post(Middlewares.userFilter, wrapper(NotionController.syncDataByUserId));

/**
 * tests api
 * */
apiV1
	.route('/tests/new-test')
	.get(Middlewares.userFilter, wrapper(TestsController.getNewTest));

apiV1.route('/tests').get();

apiV1
	.route('/tests/:testId')
	.get(Middlewares.userFilter, wrapper(TestsController.getTestById))
	// .post(Middlewares.userFilter)
	.delete(Middlewares.userFilter, wrapper(TestsController.deleteTestById));

apiV1
	.route('/questions/:questionId')
	.get(Middlewares.userFilter, wrapper(TestsController.getQuestionById))
	.post(Middlewares.userFilter, wrapper(TestsController.updateQuestion));

/**
 * users api
 * */
apiV1
	.route('/users/notion-connect')
	.get(
		Middlewares.userFilter,
		wrapper(UsersController.isUserConnectToNotion),
	);

apiV1
	.route('/users/update')
	.post(Middlewares.userFilter, wrapper(UsersController.updateUser));

export default apiV1;
