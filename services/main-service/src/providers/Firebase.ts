import { initializeApp, cert } from "firebase-admin/app";
import { Locals } from "@sipo/configs/locals.js";

class FirebaseProvider {
    app: any;

    async initFirebaseApp() {
        try {
            const { default: info } = await import(
                Locals.config().FIREBASE_ADMIN_PATH,
                {
                    assert: {
                        type: "json",
                    },
                }
            );

            this.app = initializeApp({
                credential: cert(info),
            });
        } catch (error: any) {
            console.log(error.message);
        }
    }
}

export default new FirebaseProvider();
