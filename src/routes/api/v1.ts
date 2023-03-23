import express, { Router } from "express";
import SampleController from "../../controllers/SampleController.js";
import NotionController from "../../controllers/NotionController.js";
import Auth from "../../middlewares/Auth.js";
import TestsController from "../../controllers/TestsController.js";
import UsersController from "../../controllers/UsersController.js";

const apiV1: Router = express.Router();

apiV1
    .route("/notion/auth")
    .post(Auth.userFilter, NotionController.postAuthCode as any);

apiV1
    .route("/notion/data/sync")
    .post(Auth.userFilter, NotionController.syncDataByUserId as any);

apiV1
    .route("/tests/new-test")
    .get(Auth.userFilter, TestsController.getNewTest as any);

apiV1
    .route("/users/notion-connect")
    .get(Auth.userFilter, UsersController.isUserConnectToNotion as any);

export default apiV1;
