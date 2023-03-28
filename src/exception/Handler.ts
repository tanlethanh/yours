import { StatusCodes } from "http-status-codes";
import Log from "../helpers/Log.js";
import Locals from "../providers/Locals.js";
import { Request, Response } from "express";
import { UserError } from "./Error.js";
import { MongooseError } from "mongoose";

class Handler {
    public static errorHandlerWrapper(controllerFunc: Function) {
        return async function (req: Request, res: Response, next: Function) {
            try {
                await controllerFunc(req, res, next);
            } catch (error: any) {
                if (
                    !(error instanceof UserError) ||
                    !(error instanceof MongooseError)
                )
                    return next(error);

                return res.status(StatusCodes.BAD_REQUEST).json({
                    message: error.message,
                });
            }
        };
    }

    /**
     * Handles all the not found routes
     */
    public static useNotFoundHandler(req: Request, res: Response): any {
        return res.status(StatusCodes.NOT_FOUND).json({
            message: "Not found: " + req.baseUrl,
        });
    }

    /**
     * Show undermaintenance page incase of errors
     */
    public static errorHandler(
        err: Error,
        req: Request,
        res: Response,
        next: Function
    ): any {
        Log.error(`Server error - ${err.message}`);
        console.log("Server error");
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Something went wrong with our server",
        });
    }
}

export default Handler;
