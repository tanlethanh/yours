import { getAuth } from "firebase-admin/auth";
import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import { User } from "@sipo/backend/models";
import { IUser, UserRole } from "@sipo/interfaces/IData";
import { mongoDB } from "@sipo/backend/providers";
import { UserError, config } from "@sipo/backend";

export async function userFilter(req: Request, res: Response, next: Function) {
    try {
        let user;

        if (
            // For dev mode
            config().USE_DEFAULT_USER &&
            config().NODE_ENV == "development"
        ) {
            user = mongoDB.defaultUser;
        } else {
            // For production
            const authToken = req.headers.authorization || "";

            if (!new RegExp("Bearer .*").test(authToken)) {
                throw new UserError("Invalid auth token");
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

        return next();
    } catch (error: any) {
        if (!(error instanceof UserError)) next(error);
        return res.status(StatusCodes.UNAUTHORIZED).json({
            message: error.message,
        });
    }
}

export async function adminFilter(
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

    return next();
}
