import express, { Application } from "express";
import { Locals } from "@sipo/backend";
import { ApiRoute } from "../routes";
import MoutMiddlewares from "../middlewares";
import { Handler } from "@sipo/backend";
import MongoDB from "./MongoDB";
import Firebase from "./Firebase";

class ExpressApp {
    public app: Application;

    constructor() {
        // The order of all mounting methods is important!
        this.app = express();

        // Connect to mongoDB
        MongoDB.connect();

        // Init data
        MongoDB.initData();

        // Init firebase app
        Firebase.initFirebaseApp();

        this.mountEnv();
        this.moutMidlewares();
        this.mountRoutes();
        this.mountExceptionHander();
    }

    private mountEnv() {
        Locals.mountEnvConfig(this.app);
    }

    private moutMidlewares() {
        MoutMiddlewares.mountMidlewares(this.app);
    }

    private mountRoutes() {
        ApiRoute.mountRoute(this.app);
    }

    private mountExceptionHander() {
        this.app.use("*", Handler.useNotFoundHandler);
        this.app.use(Handler.errorHandler);
    }
}

export default ExpressApp;
