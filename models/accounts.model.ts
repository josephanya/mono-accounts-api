import mongoose from 'mongoose';
import { IAccount } from '../helpers/interfaces';

const Schema = mongoose.Schema;

const accountSchema = new mongoose.Schema({
    account_number: {
        type: String,
        required: true,
        unique: true,
        length: 10
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    balance: {
        type: Number,
        default: 500000,
        required: true
    },
    currency: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        default: true,
        required: true
    },
}, { timestamps: true });

const Account = mongoose.model<IAccount>('account', accountSchema);

export default Account;