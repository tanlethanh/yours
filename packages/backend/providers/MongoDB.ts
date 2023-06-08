import { config } from '@yours/backend';
import { User } from '@yours/backend/models';
import { IUser, UserRole } from '@yours/interfaces';
import mongoose, { Connection } from 'mongoose';

class MongoDB {
	connection?: Promise<Connection>;
	connected?: boolean;
	defaultUser?: IUser | null;

	public async connect() {
		this.connected = false;
		const timeout = 10000;
		const start = Date.now();

		this.connection = new Promise((resolve, reject) => {
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
				this.connected = true;
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

	public async initData() {
		try {
			await this.connection;
			const defautUser: IUser = new User({
				email: config().DEFAULT_USER_EMAIL,
				notion_data: new Object(),
				role: UserRole.ADMIN,
				firebase_uid: config().DEFAULT_USER_FIREBASE_UID,
			});
			await defautUser.save();
			console.log('Default user is created');
			this.defaultUser = defautUser;
		} catch (error) {
			if (this.connected) {
				this.defaultUser = await User.findOne({
					email: config().DEFAULT_USER_EMAIL,
				});
			} else {
				console.log('No MongoDB');
			}
		}
	}
}

const mongoDB = new MongoDB();

export { mongoDB };
