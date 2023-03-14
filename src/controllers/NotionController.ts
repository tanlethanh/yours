import { Request, Response, query } from "express";
import { StatusCodes } from "http-status-codes";
import NotionProcessingService from "../services/NotionProcessingService.js";
import Locals from "../providers/Locals.js";
import MongoDB from "../providers/MongoDB.js";

class NotionController {
    // Hello world

    public static syncDataByUserId = async (
        req: Request | any,
        res: Response
    ) => {
        let userId = req.userId;
        if (Locals.config().NODE_ENV === "development") {
            userId = req.userId ? req.userId : MongoDB.defaultUser._id;
        }

        let result = null;
        try {
            result = await NotionProcessingService.syncDataByUserId(userId);
        } catch (error: any) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: error.message,
            });
        }

        if (!result) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "Something wrong",
            });
        } else {
            return res.status(StatusCodes.ACCEPTED).json({
                data: result,
            });
        }

    };

    public static postAuthCode = async (req: Request | any, res: Response) => {
        const { code } = req.query;

        if (!code) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "Require code as a param",
            });
        }

        let userId = req.userId;
        if (Locals.config().NODE_ENV === "development") {
            userId = req.userId ? req.userId : MongoDB.defaultUser._id;
        }

        const result = NotionProcessingService.getAndSaveAccessTokenFromNotion(
            userId,
            code
        );

        if (!result) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "Something wrong",
            });
        } else {
            return res.status(StatusCodes.ACCEPTED).json({
                data: result,
            });
        }
    };
}

export default NotionController;
