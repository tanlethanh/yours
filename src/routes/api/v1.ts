import express, { Router } from 'express';
import SampleController from '../../controllers/SampleController.js';
import NotionController from '../../controllers/NotionController.js';

const apiV1: Router = express.Router()

apiV1.route('/notion/auth')
   .post(NotionController.postAuthCode)

apiV1.route('/notion/data/sync')
   .post(NotionController.syncDataByUserId)

export default apiV1