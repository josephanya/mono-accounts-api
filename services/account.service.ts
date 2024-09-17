import { BaseError } from "../helpers/error";
import statusCode from "../helpers/status_codes";
import generateUniqueAccountNumber from '../helpers/accountNumberGenerator';
import Account from "../models/accounts.model";
import { IUser } from "../helpers/interfaces";

export default class AccountService {
    createAccount = async (user: any) => {
        try {
            const account_number = await generateUniqueAccountNumber()
            const payload = {
                account_number,
                user: user._id,
                currency: 'NGN'
            }
            const account = new Account(payload)
            await account.save()
            return account;
        } catch (e) {
            throw new BaseError('account could not be created', statusCode.conflict);
        }
    }

    checkUserAccountLimit = async (user: any) => {
        try {
            const accountCount = await Account.countDocuments({ user: user._id });
            if (accountCount >= 4) {
                throw new BaseError('user has reached the maximum limit of accounts', statusCode.conflict);
            }
            return true;
        } catch (e) {
            if (e instanceof Error) {
                throw new BaseError(e.message, statusCode.conflict);
            } else {
                throw new BaseError('error checking account limit', statusCode.conflict);
            }
        }
    };

    getUserByAccountNumber = async (account_number: string) => {
        try {
            const account = await Account.findOne({ account_number }).populate('user');
            if (!account) {
                throw new BaseError('account does not exist', statusCode.notFound);
            }
            const user = account.user as IUser;
            return {
                first_name: user.first_name,
                last_name: user.last_name
            };
        } catch (e) {
            if (e instanceof Error) {
                throw new BaseError(e.message, statusCode.notFound);
            } else {
                throw new BaseError('could not retrieve user associated with the account number', statusCode.notFound);
            }
        }
    }

    checkAccount = async (account_number: string, user_id: string) => {
        try {
            const account = await Account.findOne({ account_number, user: user_id });
            if (!account) {
                throw new BaseError('access denied: account does not belong to the user', statusCode.notFound);
            }
            return true;
        } catch (e) {
            throw new BaseError('access denied: account does not belong to the user', statusCode.notFound);
        }
    }

    getAccounts = async (user_id: string) => {
        try {
            const accounts = await Account.find({ user: user_id }, 'account_number currency balance');
            return accounts;
        } catch (e) {
            throw new BaseError('could not retrieve accounts', statusCode.notFound);
        }
    }
}