import { config } from '@yours/backend';
import { User } from '@yours/backend/models';
import { IUser, UserRole } from '@yours/interfaces';
import mongoose, { Connection } from 'mongoose';

let connection: Promise<Connection>;
export let defaultUser: IUser | null;

export async function connect() {
	const timeout = 10000;
	const start = Date.now();

	connection = new Promise((resolve, reject) => {
		let clock: string | number | NodeJS.Timeout | undefined;

		mongoose.connection.on('error', () => {
			console.log('error here', Date.now() - start);
			clock = setTimeout(() => {
				if (Date.now() - start > timeout) {
					reject('Can not connect to mongoDB');
				} else {
					mongoose.connect(config().MONGOOSE_URI);
				}
			}, 2000);
		});

		mongoose.connection.on('connected', () => {
			console.log('MongoDB connected');
			if (clock) clearTimeout(clock);
			resolve(mongoose.connection);
		});
	});

	try {
		await mongoose.connect(config().MONGOOSE_URI, {
			serverSelectionTimeoutMS: 5000,
		});
	} catch (error) {
		console.log({ error });
	}
}

export async function initData() {
	try {
		await connection;
		defaultUser = new User({
			email: config().DEFAULT_USER_EMAIL,
			notion_data: new Object(),
			role: UserRole.ADMIN,
			firebase_uid: config().DEFAULT_USER_FIREBASE_UID,
		});
		await defaultUser.save();
		console.log('Default user is created');
	} catch (error) {
		defaultUser = await User.findOne({
			email: config().DEFAULT_USER_EMAIL,
		});
	}
}
