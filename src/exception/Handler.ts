import { StatusCodes } from "http-status-codes";
import Log from "../helpers/Log.js";
import Locals from "../providers/Locals.js";
import { Request, Response } from "express";

class Handler {
    /**
     * Handles all the not found routes
     */
    public static useNotFoundHandler(req: Request, res: Response): any {
        return res.status(StatusCodes.NOT_FOUND).json({
            message: "Not found: " + req.url,
        });
    }

    /**
     * Show undermaintenance page incase of errors
     */
    public static useErrorHandler(
        err: Error,
        req: Request,
        res: Response
    ): any {
        Log.error(`Server error - ${err.message}`);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Something went wrong with our server",
        });
    }
}

export default Handler;
