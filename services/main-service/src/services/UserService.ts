import { IUser } from "../interfaces/IData";
import { User } from "../models/UserModel";

class UserService {
    async updateUser(userUpdate: IUser) {
        const user = await User.findById(userUpdate._id);
        console.log(user);
        console.log("AAA");
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
