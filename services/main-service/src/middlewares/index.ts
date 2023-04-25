import { Application } from "express";

import CORS from "./CORS.js";
import Http from "./Http.js";
import Statics from "./Statics.js";
import { StatusMonitor } from "@sipo/backend/helpers";
import { Locals } from "@sipo/configs/locals.js";

class MoutMiddlewares {
    public static mountMidlewares(_express: Application) {
        // Check if CORS is enabled
        if (Locals.config().isCORSEnabled) {
            // Mount CORS middleware
            CORS.mount(_express);
        }

        // Mount basic express apis middleware
        Http.mount(_express);

        // Mount statics middleware
        Statics.mount(_express);

        // Mount status monitor middlewar
        StatusMonitor.mount(_express);

        // Mount proxy
        // Proxy.mountProxy(_express);
    }
}

export default MoutMiddlewares;
