import { config } from '@yours/backend';
import { User } from '@yours/backend/models';
import { IUser, UserRole } from '@yours/interfaces';
import mongoose from 'mongoose';

class MongoDB {
	connection?: Promise<typeof mongoose>;
	defaultUser?: IUser | null;
	connected?: boolean;

	constructor() {
		this.connected = false;
	}

	public async connect() {
		try {
			console.log(`MongoDB URI: ${config().MONGOOSE_URI}`);
			this.connection = mongoose.connect(config().MONGOOSE_URI);
			await this.connection;
			this.connected = true;
			console.log('MongoDB connected!');
		} catch (error) {
			console.log('MongoDB error');
			console.error((error as Error).message);
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
