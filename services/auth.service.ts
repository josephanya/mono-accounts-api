import { BaseError } from "../helpers/error";
import utils from "../helpers/utils";
import statusCode from "../helpers/status_codes";
import User from "../models/users.model";

export default class AuthService {
    verifyPassword = async (password: string, user: any) => {
        const passwordMatch = utils.comparePassword(password, user.password);
        if (!passwordMatch) {
            throw new BaseError('invalid password', statusCode.unAuthorized);
        }
        return true
    }

    saveLastLogin = async (email: string) => {
        await User.findOneAndUpdate(
            { email },
            { last_login: new Date() }
        );
    }
}