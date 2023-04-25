import mongoose from "mongoose";
import { config } from "@sipo/backend";
import { User } from "@sipo/backend/models";
import { IUser, UserRole } from "@sipo/interfaces";

class MongoDB {
    connection: any;
    defaultUser: IUser | any;
    connected: boolean | undefined;

    constructor() {
        this.connected = false;
    }

    public async connect() {
        try {
            console.log(`MongoDB URI: ${config().MONGOOSE_URI}`);
            this.connection = mongoose.connect(config().MONGOOSE_URI);
            await this.connection;
            this.connected = true;
            console.log("MongoDB connected!");
        } catch (error: any) {
            console.log("MongoDB error");
            console.error(error.message);
            // process.exit(1);
        }
    }

    public async initData() {
        try {
            await this.connection;
            const defautUser: IUser = new User({
                email: config().DEFAULT_USER_EMAIL,
                notion_data: new Object(),
                role: UserRole.ADMIN,
                firebase_uid: config().DEFAULT_USER_FIREBASE_UID,
            });
            await defautUser.save();
            console.log("Default user is created");
            this.defaultUser = defautUser;
        } catch (error) {
            // console.log(error);
            if (this.connected) {
                this.defaultUser = await User.findOne({
                    email: config().DEFAULT_USER_EMAIL,
                });
            } else {
                console.log("No MongoDB");
            }
        }
    }
}

const mongoDB = new MongoDB();

export { mongoDB };
