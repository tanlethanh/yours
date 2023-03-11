import mongoose from "mongoose";
import Locals from "./Locals";
import { Page } from "../models";
import { IPage } from "../interfaces/IData";

class MongoDB {
    public static async connect() {
        try {
            console.log(`MongoDB URI: ${Locals.config().MONGOOSE_URI}`);
            await mongoose.connect(Locals.config().MONGOOSE_URI);
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
}

export default MongoDB;
