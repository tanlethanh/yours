import cors from "cors";
import { Application } from "express";

import { log } from "@sipo/backend";

class CORS {
    public static mount(_express: Application) {
        log.info("Booting the 'CORS' middleware...");

        const options: cors.CorsOptions = {
            origin: "*",
            optionsSuccessStatus: 200, // Some legacy browsers choke on 204
        };

        _express.use(cors(options));
    }
}

export default CORS;
