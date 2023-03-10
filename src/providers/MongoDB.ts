import mongoose from "mongoose";
import Locals from "./Locals";

class MongoDB {
    public static async connect() {
        try {
            await mongoose.connect(Locals.config().MONGOOSE_URI);
            console.log("MongoDB connected!");
        } catch (error: any) {
            console.error(error.message);
            process.exit(1);
        }
    }
}

export default MongoDB;
