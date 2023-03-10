import express, { Router } from 'express';
import SampleController from '../../controllers/SampleController';
import NotionAuthController from '../../controllers/NotionAuthController';

const apiV1: Router = express.Router()

apiV1.route('/notion-auth')
   .post(NotionAuthController.postCode)

export default apiV1