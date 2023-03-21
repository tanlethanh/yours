import express, { Application } from "express";
import Locals from "./Locals.js";
import { ApiRoute } from "../routes/index.js";
import MoutMiddlewares from "../middlewares/index.js";
import Handler from "../exception/Handler.js";
import MongoDB from "./MongoDB.js";
import Firebase from "./Firebase.js";

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
        this.app.use(Handler.useLogErrors);
        this.app.use(Handler.useClientErrorHandler);
        this.app.use(Handler.useErrorHandler);
    }
}

export default ExpressApp;
