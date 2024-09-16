import { Types } from "mongoose";

export interface IUser extends Document {
    _id: Types.ObjectId;
    first_name: string;
    last_name: string;
    email: string;
    active: boolean;
    last_login: Date;
}

export interface IAccount extends Document {
    _id: Types.ObjectId;
    account_number: string;
    balance: number;
    user: Types.ObjectId | IUser;
    currency: string;
    active: boolean;
}

export interface ITransaction extends Document {
    _id: Types.ObjectId;
    amount: number;
    sender: Types.ObjectId;
    recipient: Types.ObjectId;
    type: 'debit' | 'credit';
    narration?: string;
    date: Date;
}