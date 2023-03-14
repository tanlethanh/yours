import mongoose from "mongoose";
import Locals from "./Locals.js";
import { Page, User } from "../models/index.js";
import { IPage, IUser } from "../interfaces/IData.js";

class MongoDB {
    connection: any;
    defaultUser: IUser | any;

    public async connect() {
        try {
            console.log(`MongoDB URI: ${Locals.config().MONGOOSE_URI}`);
            this.connection = mongoose.connect(Locals.config().MONGOOSE_URI);
            await this.connection;
            console.log("MongoDB connected!");
            // const newPage: IPage = new Page({
            //     root_id: "abc",
            //     title: "Page đầu tiên",
            //     url: "https://google.com"

            // })
            // newPage.save()
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
                email: "tantainang8266@gmail.com",
                username: "tanle",
                password: "123456",
                notion_data: new Object(),
            });
            await defautUser.save();
            this.defaultUser = defautUser;
        } catch (error) {
            // console.log(erorr);
            this.defaultUser = await User.findOne({
                email: "tantainang8266@gmail.com",
            });
        }
    }
}

export default new MongoDB();
