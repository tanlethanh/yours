import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import NotionProvider from "../providers/Notion";

class NotionAuthController {
    public static postCode = async (req: Request, res: Response) => {
        console.log(req.query.code);

        try {
            const accessToken = await NotionProvider.getAccessTokenFromCode(
                req.query.code as string
            );
            return res.status(StatusCodes.CREATED).json(accessToken);
        } catch (error) {
            return res.status(StatusCodes.BAD_REQUEST).json(error);
        }
    };
}

export default NotionAuthController;
