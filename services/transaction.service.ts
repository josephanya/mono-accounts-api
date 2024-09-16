import { BaseError } from "../helpers/error";
import statusCode from "../helpers/status_codes";
import Account from "../models/accounts.model";
import mongoose from 'mongoose';
import Transaction from "../models/transactions.model";

export default class TransactionService {
    sendMoney = async (sender_account_number: string, user_id: string, recipient_account_number: string, amount: number, narration?: string) => {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const senderAccount = await Account.findOne({ account_number: sender_account_number, user: user_id }).session(session);
            const recipientAccount = await Account.findOne({ account_number: recipient_account_number }).session(session);
            if (!senderAccount) {
                throw new BaseError('sender account does not exist', statusCode.notFound);
            }
            if (!recipientAccount) {
                throw new BaseError('recipient account does not exist', statusCode.notFound);
            }
            amount = +amount
            if (senderAccount.balance < amount) {
                throw new BaseError('insufficient funds', statusCode.badRequest);
            }
            senderAccount.balance -= amount;
            await senderAccount.save({ session });
            recipientAccount.balance += amount;
            await recipientAccount.save({ session });
            const senderTransaction = new Transaction({
                amount,
                sender: senderAccount._id,
                recipient: recipientAccount._id,
                type: 'debit',
                balance: senderAccount.balance,
                currency: 'NGN',
                narration,
                description: `Transferred NGN ${amount} from ${sender_account_number} to ${recipient_account_number}`,
            });
            await senderTransaction.save({ session });
            const recipientTransaction = new Transaction({
                amount,
                sender: senderAccount._id,
                recipient: recipientAccount._id,
                type: 'credit',
                balance: recipientAccount.balance,
                currency: 'NGN',
                narration,
                description: `received NGN ${amount} from ${sender_account_number}`,
            });
            await recipientTransaction.save({ session });
            await session.commitTransaction();
            session.endSession();
            return senderTransaction;
        } catch (e) {
            await session.abortTransaction();
            session.endSession();
            if (e instanceof Error) {
                throw new BaseError(e.message, statusCode.notFound);
            } else {
                throw new BaseError('transfer failed', statusCode.notFound);
            }
        }
    }; 

    getTransactions = async (page: number, limit: number, accountId: any) => {
        try {
            const transactions = await Transaction.find({
                $or: [
                  { sender: accountId },
                  { recipient: accountId },
                ],
              })
                .sort({ 'date': -1 })
                .skip((page - 1) * limit)
                .limit(limit * 1);
            const count = await Transaction.countDocuments({
                $or: [
                  { sender: accountId },
                  { recipient: accountId },
                ],
              });
            return {
                transactions,
                total_pages: Math.ceil(count / limit),
                current_page: page
            }
        } catch (e) {
            throw new BaseError('transactions could not be fetched', statusCode.notFound);
        }
    }
} 