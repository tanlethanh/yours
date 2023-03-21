import { Application } from "express";
import apiV1 from "./api/v1.js";

class ApiRoute {
    app: Application;

    constructor(_express: Application) {
        this.app = _express;
    }
 
    public static mountRoute(_express: Application) {
        console.log('Mount API route')
        ApiRoute.mountRouteV1(_express)
    }

    private static mountRouteV1(_express: Application) {
        _express.use("/api/v1", apiV1);
    }

    mountSingleRoute() {}
}

export { ApiRoute };
