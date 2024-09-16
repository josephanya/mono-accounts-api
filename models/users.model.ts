import mongoose from 'mongoose';
import { IUser } from '../helpers/interfaces';

const Schema = mongoose.Schema;

const userSchema = new Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
    },
    active: {
        type: Boolean,
        default: true,
        required: true
    },
    last_login: {
        type: Date,
    },
}, { timestamps: true });

const User = mongoose.model<IUser>('user', userSchema);

export default User;