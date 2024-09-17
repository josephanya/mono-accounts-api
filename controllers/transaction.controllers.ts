import { Request, Response, NextFunction } from "express";
import CustomResponse from "../helpers/response"
import statusCode from "../helpers/status_codes"
import AccountService from "../services/account.service";
import TransactionService from "../services/transaction.service";
import pino from "pino";

const logger = pino();

class TransactionControllers {
    private transactionService: TransactionService;
    private accountService: AccountService;

    constructor() {
        this.transactionService = new TransactionService();
        this.accountService = new AccountService();
    }

    sendMoney = async (req: Request, res: Response, next: NextFunction) => {
        const { sender_account_number, user_id, recipient_account_number, amount, narration } = req.body
        try {
            await this.accountService.checkAccount(sender_account_number, user_id)
            const transaction = await this.transactionService.sendMoney(sender_account_number, user_id, recipient_account_number, amount, narration)
            return CustomResponse.success(res, statusCode.success, 'transfer successful', { transaction });
        } catch (e) {
            logger.error(e instanceof Error ? e.message : 'an unknown error occurred');
            next(e);
        }
    }

    getTransactions = async (req: Request, res: Response, next: NextFunction) => {
        const account_number = req.params.account_number;
        const { user_id } = req.body
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        try {
            await this.accountService.checkAccount(account_number, user_id)
            const transactions = await this.transactionService.getTransactions(page, limit, account_number)
            return CustomResponse.success(res, statusCode.success, 'transactions fetched successfully', transactions);
        } catch (e) {
            next(e)
        }
    }
}

export default new TransactionControllers();