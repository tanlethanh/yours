import { Application, Request, Response } from "express";
import apiV1 from "./api/v1";
import { StatusCodes } from "http-status-codes";

class ApiRoute {
    app: Application;

    constructor(_express: Application) {
        this.app = _express;
    }

    public static mountRoute(_express: Application) {
        console.log("Mount API route");

        // Basic api
        _express.get("/", (req: Request, res: Response) => {
            return res.status(StatusCodes.OK).json({
                message: "Hello world",
            });
        });

        ApiRoute.mountRouteV1(_express);
    }

    private static mountRouteV1(_express: Application) {
        _express.use("/api/v1", apiV1);
    }

    mountSingleRoute() {}
}

export { ApiRoute };
