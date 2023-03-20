import { initializeApp, refreshToken } from "firebase-admin/app";
import Locals from "./Locals.js";

class FirebaseProvider {
    app;

    constructor() {
        this.app = initializeApp({
            credential: refreshToken(Locals.config().FIREBASE_REFRESH_TOKEN),
            databaseURL: Locals.config().FIREBASE_DB_URL,
        });
    }
}

export default new FirebaseProvider();
