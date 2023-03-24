import express, { Router } from "express";
import NotionController from "../../controllers/NotionController.js";
import Auth from "../../middlewares/Auth.js";
import TestsController from "../../controllers/TestsController.js";
import UsersController from "../../controllers/UsersController.js";
import Handler from "../../exception/Handler.js";

const apiV1: Router = express.Router();

const wrapper = Handler.errorHandlerWrapper;

/**
 * notion api
 * */
apiV1
    .route("/notion/auth")
    .post(Auth.userFilter, wrapper(NotionController.postAuthCode));

apiV1
    .route("/notion/data/sync")
    .post(Auth.userFilter, wrapper(NotionController.syncDataByUserId));

/**
 * tests api
 * */
apiV1
    .route("/tests/new-test")
    .get(Auth.userFilter, wrapper(TestsController.getNewTest));

apiV1.route("/tests").get();

apiV1
    .route("/tests/:testId")
    .get(Auth.userFilter, wrapper(TestsController.getTestById))
    // .post(Auth.userFilter)
    .delete(Auth.userFilter, wrapper(TestsController.deleteTestById))

apiV1
    .route("/questions/:questionId")
    .get(Auth.userFilter, wrapper(TestsController.getQuestionById))
    .post(Auth.userFilter, wrapper(TestsController.updateQuestion));

/**
 * users api
 * */
apiV1
    .route("/users/notion-connect")
    .get(Auth.userFilter, wrapper(UsersController.isUserConnectToNotion));

export default apiV1;
