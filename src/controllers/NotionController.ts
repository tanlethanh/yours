import { Request, Response, query } from "express";
import { StatusCodes } from "http-status-codes";
import NotionProcessingService from "../services/NotionProcessingService";
import Locals from "../providers/Locals";
import MongoDB from "../providers/MongoDB";

class NotionController {
    public static syncDataByUserId = async (req: Request, res: Response) => {
        const userId = req.query.userId;
        if (userId) {
        } else {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "Require userId as a param",
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
        console.log(Locals.config().NODE_ENV)
        console.log(MongoDB.defaultUser._id)
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
