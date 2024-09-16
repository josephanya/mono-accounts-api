import { Request, Response, NextFunction } from "express";
import UserService from "../services/user.service";
import AuthService from "../services/auth.service";
import CustomResponse from "../helpers/response"
import statusCode from "../helpers/status_codes"
import AccountService from "../services/account.service";
import pino from "pino";

const logger = pino();

class AccountControllers {
    private userService: UserService;
    private authService: AuthService;
    private accountService: AccountService;

    constructor() {
        this.userService = new UserService();
        this.authService = new AuthService();
        this.accountService = new AccountService();
    }

    createAccount = async (req: Request, res: Response, next: NextFunction) => {
        const { user_id } = req.body
        try {
            const user = await this.userService.getUserById(user_id)
            await this.accountService.checkUserAccountLimit(user);
            const account = await this.accountService.createAccount(user);
            return CustomResponse.success(res, statusCode.success, 'account created successfully', { account_number: account.account_number, user_id: user._id });
        } catch (e) {
            logger.error(e)
            next(e);
        }
    }

    searchAccount = async (req: Request, res: Response, next: NextFunction) => {
        const { account_number } = req.body;
        try {
            const user = await this.accountService.getUserByAccountNumber(account_number);
            return CustomResponse.success(res, statusCode.success, 'user fetched successfully', { user });
        } catch (e) {
            logger.error(e)
            next(e);
        }
    }

    getAccounts = async (req: Request, res: Response, next: NextFunction) => {
        const { user_id } = req.body
        try {
            await this.userService.getUserById(user_id)
            const accounts = await this.accountService.getAccounts(user_id)
            return CustomResponse.success(res, statusCode.success, 'user fetched successfully', { accounts });
        } catch (e) {
            
        }
    }
}

export default new AccountControllers();