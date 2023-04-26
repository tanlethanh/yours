import { initializeApp, cert } from "firebase-admin/app";
import { config } from "@yours/backend";

class FirebaseProvider {
    app: any;

    async initFirebaseApp() {
        try {
            const { default: info } = require(config().FIREBASE_ADMIN_PATH);

            this.app = initializeApp({
                credential: cert(info),
            });
        } catch (error: any) {
            console.log(error.message);
        }
    }
}

const firebaseProvider = new FirebaseProvider();

export { firebaseProvider };
