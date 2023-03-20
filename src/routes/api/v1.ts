import express, { Router } from "express";
import SampleController from "../../controllers/SampleController.js";
import NotionController from "../../controllers/NotionController.js";
import Auth from "../../middlewares/Auth.js";

const apiV1: Router = express.Router();

apiV1
    .route("/notion/auth")
    .post(Auth.userFilter, NotionController.postAuthCode as any);

apiV1
    .route("/notion/data/sync")
    .post(Auth.userFilter, NotionController.syncDataByUserId as any);

export default apiV1;
