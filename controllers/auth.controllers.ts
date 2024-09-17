import { Request, Response, NextFunction } from "express";
import UserService from "../services/user.service";
import AuthService from "../services/auth.service";
import utils from "../helpers/utils";
import CustomResponse from "../helpers/response"
import statusCode from "../helpers/status_codes"
import AccountService from "../services/account.service";
import pino from "pino";

const logger = pino();

class AuthControllers {
    private userService: UserService;
    private authService: AuthService;
    private accountService: AccountService;

    constructor() {
        this.userService = new UserService();
        this.authService = new AuthService();
        this.accountService = new AccountService();
    }

    signUp = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = await this.userService.addUser(req.body)
            const auth_token = utils.generateAuthToken(user);
            await this.authService.saveLastLogin(user.email);
            await this.accountService.createAccount(user);
            return CustomResponse.success(res, statusCode.created, 'user creation successful', { auth_token, user_id: user._id });
        } catch (e) {
            logger.error(e instanceof Error ? e.message : 'an unknown error occurred');
            next(e);
        }
    }

    login = async (req: Request, res: Response, next: NextFunction) => {
        const { email, password } = req.body;
        try {
            const user = await this.userService.getUserByEmail(email)
            await this.authService.verifyPassword(password, user);
            const auth_token = utils.generateAuthToken(user);
            await this.authService.saveLastLogin(user.email);
            return CustomResponse.success(res, statusCode.success, 'login successful', { auth_token, user_id: user._id });
        } catch (e) {
            logger.error(e instanceof Error ? e.message : 'an unknown error occurred');
            next(e);
        }
    }
}

export default new AuthControllers();