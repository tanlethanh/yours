import { Request, Response } from "express";
import { IUser } from "../interfaces/IData.js";
import { StatusCodes } from "http-status-codes";
import TestGenerationService from "../services/TestGenerationService.js";
import { TestGenerationStrategies } from "../interfaces/IData.js";
import { User } from "../models/UserModel.js";

class UsersController {
    public static async isUserConnectToNotion(
        req: Request & { user: IUser },
        res: Response
    ) {
        const user = await User.findById(req.user._id, {
            notion_data: 1,
        });

        if (user?.notion_data?.access_token) {
            return res.status(StatusCodes.OK).json({
                is_connected: true,
            });
        } else {
            return res.status(StatusCodes.OK).json({
                is_connected: false,
            });
        }
    }
}

export default UsersController;
