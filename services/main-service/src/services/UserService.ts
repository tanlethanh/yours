import { IUser } from "@yours/interfaces";
import { User } from "@yours/backend";

class UserService {
    async updateUser(userUpdate: IUser) {
        const user = await User.findById(userUpdate._id);
        await User.findByIdAndUpdate(
            { _id: userUpdate._id },
            { $set: userUpdate }
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
