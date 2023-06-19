import { userFilter } from '@yours/backend';
import { controllerErrorHanlder } from '@yours/backend';
import express, { Router } from 'express';

import NotionController from '../../controllers/NotionController';
import TestsController from '../../controllers/TestsController';
import UsersController from '../../controllers/UsersController';

const apiV1: Router = express.Router();

const wrapper = controllerErrorHanlder;

/**
 * notion api
 * */
apiV1
	.route('/notion/auth')
	.post(userFilter, wrapper(NotionController.postAuthCode));

apiV1
	.route('/notion/data/sync')
	.post(userFilter, wrapper(NotionController.syncDataByUserId));

/**
 * tests api
 * */
apiV1
	.route('/tests/new-test')
	.get(userFilter, wrapper(TestsController.getNewTest));

apiV1.route('/tests').get();

apiV1
	.route('/tests/:testId')
	.get(userFilter, wrapper(TestsController.getTestById))
	.delete(userFilter, wrapper(TestsController.deleteTestById));

apiV1
	.route('/questions/:questionId')
	.get(userFilter, wrapper(TestsController.getQuestionById))
	.post(userFilter, wrapper(TestsController.updateQuestion));

/**
 * users api
 * */
apiV1
	.route('/users/notion-connect')
	.get(userFilter, wrapper(UsersController.isUserConnectToNotion));

apiV1
	.route('/users/update')
	.post(userFilter, wrapper(UsersController.updateUser));

export default apiV1;
