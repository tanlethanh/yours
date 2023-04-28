import { User } from '@yours/backend';
import { IUser } from '@yours/interfaces';

class UserService {
	async updateUser(userUpdate: IUser) {
		await User.findById(userUpdate._id);
		await User.findByIdAndUpdate(
			{ _id: userUpdate._id },
			{ $set: userUpdate },
		)
			.then((updatedUser) => {
				console.log(updatedUser);
			})
			.catch((error) => {
				console.log(error);
			});
	}
}

export default new UserService();
