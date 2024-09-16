import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const secretKey: string = process.env.AUTH_SECRET || ''

class Utils {
    hashPassword = (password: string) => {
        return bcrypt.hashSync(password, 12);
    }

    comparePassword = (inputedPassword: string, password: string) => {
        return bcrypt.compareSync(inputedPassword, password);
    }

    generateAuthToken = (user: any) => {
        return jwt.sign({
            email: user.email,
            user_id: user._id,
        }, secretKey)
    }
}

export default new Utils();