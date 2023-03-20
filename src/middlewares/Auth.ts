import { getAuth } from "firebase-admin/auth";
import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import { User } from "../models/UserModel.js";
import { IUser, UserRole } from "../interfaces/IData.js";
import Locals from "../providers/Locals.js";
import MongoDB from "../providers/MongoDB.js";

class Auth {
    public static async userFilter(
        req: Request,
        res: Response,
        next: Function
    ) {
        try {
            let user;

            if (
                // For dev mode
                Locals.config().USE_DEFAULT_USER &&
                Locals.config().NODE_ENV == "development"
            ) {
                user = MongoDB.defaultUser;
            } else {
                // For production
                const authToken = req.headers.authorization || "";

                if (!new RegExp("Bearer .*").test(authToken)) {
                    throw Error("Invalid auth token");
                }

                const idToken = authToken.split(" ")[1];

                const decodedToken = await getAuth().verifyIdToken(idToken);
                const uid = decodedToken.uid;

                user = await User.findOne({
                    firebase_uid: uid,
                });

                if (!user) {
                    const firebaseUser = await getAuth().getUser(uid);

                    user = await User.create({
                        email: firebaseUser.email,
                        firebase_uid: uid,
                        role: UserRole.USER,
                    });
                }
            }

            (req as any).user = user;

            return next(req, res);
        } catch (error: any) {
            console.log(error);
            return res.status(StatusCodes.UNAUTHORIZED).json({
                message: error.message,
            });
        }
    }

    public static adminFilter(
        req: Request & { user: IUser },
        res: Response,
        next: Function
    ) {
        if (!req.user) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                message: "Invalid user",
            });
        }

        if (req.user.role !== UserRole.ADMIN) {
            return res.status(StatusCodes.FORBIDDEN).json({
                message: "This user is not admin",
            });
        }

        return next(req, res);
    }
}

export default Auth;
