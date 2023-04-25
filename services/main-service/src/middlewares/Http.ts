import { Application } from "express";
import bodyParser from "body-parser";
// import cookieParser from('cookie-parser');
// import * as flash from 'express-flash';
// import * as compress from 'compression';
// import * as expressValidator from 'express-validator';

import { log } from "@sipo/backend";
import { Locals } from "@sipo/backend";

class Http {
    public static mount(_express: Application) {
        log.info("Booting the 'HTTP' middleware...");

        // _express.use(cookieParser(process.env.JWT_SECRET));

        // Enables the request body parser
        _express.use(
            bodyParser.json({
                limit: Locals.config().MAX_UPLOAD_LIMIT,
            })
        );

        _express.use(
            bodyParser.urlencoded({
                limit: Locals.config().maxUploadLimit,
                parameterLimit: Locals.config().maxParameterLimit,
                extended: false,
            })
        );

        // Disable the x-powered-by header in response
        _express.disable("x-powered-by");
    }
}

export default Http;
