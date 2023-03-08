import express, { Application } from "express";
import Locals from "./Locals";
import { ApiRoute } from "../routes/";
import MoutMiddlewares from "../middlewares";
import Handler from "../exception/Handler";

class ExpressApp {
    public app: Application;

    constructor() {
        // The order of all mounting methods is important!
        this.app = express();
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
