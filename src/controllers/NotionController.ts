import { Request, Response, query } from "express";
import { StatusCodes } from "http-status-codes";
import NotionProcessingService from "../services/NotionProcessingService.js";
import Locals from "../providers/Locals.js";
import { IUser } from "../interfaces/IData.js";
import { Types } from "mongoose";

class NotionController {
    // Hello world

    public static syncDataByUserId = async (
        req: Request & { user: IUser },
        res: Response
    ) => {
        let userId = req.user._id;

        let result = null;
        try {
            result = await NotionProcessingService.syncDataByUserId(userId as any);
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

    public static postAuthCode = async (
        req: Request & { user: IUser },
        res: Response
    ) => {
        const { code } = req.query;

        if (!code) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "Require code as a param",
            });
        }

        let userId = req.user.id;

        const result = await NotionProcessingService.getAndSaveAccessTokenFromNotion(
            userId,
            code as string
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
