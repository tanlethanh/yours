import { initializeApp, cert } from "firebase-admin/app";
import { config } from "@yours/backend";

class FirebaseProvider {
    app: any;

    async initFirebaseApp() {
        try {
            const serviceAccount = require(config().FIREBASE_ADMIN_PATH);

            this.app = initializeApp({
                credential: cert(serviceAccount),
            });
        } catch (error: any) {
            console.log(error.message);
        }
    }
}

const firebaseProvider = new FirebaseProvider();

export { firebaseProvider };
