import mongoose from "mongoose";
import Locals from "./Locals.js";
import { Page, User } from "../models/index.js";
import { IPage, IUser, UserRole } from "../interfaces/IData.js";

class MongoDB {
    connection: any;
    defaultUser: IUser | any;

    public async connect() {
        try {
            console.log(`MongoDB URI: ${Locals.config().MONGOOSE_URI}`);
            this.connection = mongoose.connect(Locals.config().MONGOOSE_URI);
            await this.connection;
            console.log("MongoDB connected!");
        } catch (error: any) {
            console.log("MongoDB error");
            console.error(error.message);
            process.exit(1);
        }
    }

    public async initData() {
        try {
            await this.connection;
            const defautUser: IUser = new User({
                email: Locals.config().DEFAULT_USER_EMAIL,
                notion_data: new Object(),
                role: UserRole.ADMIN,
                firebase_uid: Locals.config().DEFAULT_USER_FIREBASE_UID,
            });
            await defautUser.save();
            console.log("Default user is created")
            this.defaultUser = defautUser;
        } catch (error) {
            // console.log(error);
            this.defaultUser = await User.findOne({
                email: Locals.config().DEFAULT_USER_EMAIL,
            });
        }
    }
}

export default new MongoDB();
