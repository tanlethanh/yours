import express, { Router } from 'express';
import SampleController from '../../controllers/SampleController';

const apiV1: Router = express.Router()

apiV1.route('/sample')
   .get(SampleController.getSample)

apiV1.route('/hello')

export default apiV1