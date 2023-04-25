import * as path from "path";
import express, { Application } from "express";

import { log } from "@sipo/backend";

class Statics {
    public static mount(_express: Application) {
        log.info("Booting the 'Statics' middleiware...");

        // Loads Options
        const options = { maxAge: 31557600000 };

        // Load Statics
        _express.use(
            "/public",
            express.static(path.join(__dirname, "../../public"), options)
        );

        // Load NPM Statics
        _express.use(
            "/vendor",
            express.static(path.join(__dirname, "../../node_modules"), options)
        );
    }
}

export default Statics;
