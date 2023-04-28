import { config } from '@yours/backend';
import { App, cert, initializeApp } from 'firebase-admin/app';

class FirebaseProvider {
	app?: App;

	async initFirebaseApp() {
		try {
			const serviceAccount = require(config().FIREBASE_ADMIN_PATH);

			this.app = initializeApp({
				credential: cert(serviceAccount),
			});
		} catch (error) {
			console.log((error as Error).message);
		}
	}
}

const firebaseProvider = new FirebaseProvider();

export { firebaseProvider };
