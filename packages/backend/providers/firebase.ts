import { config } from '@yours/backend';
import { cert, initializeApp } from 'firebase-admin/app';

async function initFirebaseApp() {
	try {
		const serviceAccount = require(config().FIREBASE_ADMIN_PATH);
		initializeApp({
			credential: cert(serviceAccount),
		});
	} catch (error) {
		console.log((error as Error).message);
	}
}

export { initFirebaseApp };
