import { BaseError } from "../helpers/error";
import User from "../models/users.model";
import statusCode from "../helpers/status_codes";
import utils from "../helpers/utils";

export default class UserService {
    addUser = async (body: any) => {
        const { first_name, last_name, email, password } = body;
        try {
            let user = await User.findOne({ email })
            if (user) {
                throw new BaseError('user already exists', statusCode.conflict);
            }
            const hash = utils.hashPassword(password)
            const payload = {
                first_name,
                last_name,
                email,
                password: hash
            }
            user = new User(payload)
            await user.save()
            return user;
        } catch (e) {
            if (e instanceof Error) {
                throw new BaseError(e.message, statusCode.notFound);
            } else {
                throw new BaseError('user could not be created', statusCode.conflict);
            }
        }
    }

    getUserById = async (id: string) => {
        try {
            const user = await User.findById(id)
            if (!user) {
                throw new BaseError('user does not exist', statusCode.notFound);
            }
            return user;
        } catch (e) {
            if (e instanceof Error) {
                throw new BaseError(e.message, statusCode.notFound);
            } else {
                throw new BaseError('user does not exist', statusCode.notFound);
            }
        }
    }

    getUserByEmail = async (email: string) => {
        try {
            const user = await User.findOne({ email })
            if (!user) {
                throw new BaseError('user does not exist', statusCode.notFound);
            }
            return user;
        } catch (e) {
            if (e instanceof Error) {
                throw new BaseError(e.message, statusCode.notFound);
            } else {
                throw new BaseError('user does not exist', statusCode.notFound);
            }
        }
    }
}
