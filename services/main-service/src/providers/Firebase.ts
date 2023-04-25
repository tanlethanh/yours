import { initializeApp, cert } from "firebase-admin/app";
import { Locals } from "@sipo/backend";

class FirebaseProvider {
    app: any;

    async initFirebaseApp() {
        try {
            const { default: info } = require(Locals.config()
                .FIREBASE_ADMIN_PATH);

            this.app = initializeApp({
                credential: cert(info),
            });
        } catch (error: any) {
            console.log(error.message);
        }
    }
}

export default new FirebaseProvider();
