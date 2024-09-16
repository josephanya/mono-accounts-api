import mongoose from 'mongoose';
import { ITransaction } from '../helpers/interfaces';

const Schema = mongoose.Schema;

const transactionSchema = new Schema({
    type: {
        type: String,
        enum: ['debit', 'credit'],
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    narration: {
        type: String,
    },
    date: {
        type: Date,
    },
    balance: {
        type: Number
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'account'
    },
    recipient: {
        type: Schema.Types.ObjectId,
        ref: 'account'
    },
    currency: {
        type: String,
    },
}, { timestamps: true });

const Transaction = mongoose.model<ITransaction>('transaction', transactionSchema);

export default Transaction;