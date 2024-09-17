import app from '../../app';
import mongoose from 'mongoose';
import request from 'supertest';
import Account from '../../models/accounts.model';
import User from '../../models/users.model';

let authToken: string;
let userId: string;

beforeAll(async () => {
    await mongoose.connect("mongodb://localhost:27017/banktest");
    await User.deleteMany({});
    await Account.deleteMany({});
    const res = await request(app)
        .post('/v1/auth/sign-up')
        .send({
            "first_name": "Joseph",
            "last_name": "Anya",
            "email": "joseph@mono.co",
            "password": "12345678"
        });
    userId = res.body.data.user_id;
    authToken = res.body.data.auth_token;
});

describe('account endpoints', () => {
    it('should create a new account for the user', async () => {
        const res = await request(app)
            .post('/v1/account/create')
            .set('Authorization', `Bearer ${authToken}`)
            .send();
        expect(res.status).toBe(201);
        expect(res.body.data).toHaveProperty('account_number');
    });

    it('should not allow more than 4 accounts per user', async () => {
        // create 3 additional accounts
        for (let i = 0; i < 3; i++) {
            await request(app)
                .post('/v1/account/create')
                .set('Authorization', `Bearer ${authToken}`)
                .send();
        }
        // try to create a 5th account
        const res = await request(app)
            .post('/v1/account/create')
            .set('Authorization', `Bearer ${authToken}`)
            .send();
        expect(res.status).toBe(409);
        expect(res.body).toHaveProperty('message', 'user has reached the maximum limit of accounts');
    });

    it('should get all accounts for the user', async () => {
        const res = await request(app)
            .get('/v1/account')
            .set('Authorization', `Bearer ${authToken}`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body.data.accounts)).toBe(true);
        expect(res.body.data.accounts.length).toBe(4);
        res.body.data.accounts.forEach((account: any) => {
            expect(account).toHaveProperty('account_number');
            expect(account).toHaveProperty('balance', 500000);
        });
    });

    it('should search for an account by account number', async () => {
        const accounts = await Account.find({ user: userId });
        const accountNumber = accounts[0].account_number;
        const res = await request(app)
          .post('/v1/account/search')
          .set('Authorization', `Bearer ${authToken}`)
          .send({"account_number": `${accountNumber}`});
        expect(res.status).toBe(200);
        expect(res.body.data.user).toHaveProperty('first_name');
        expect(res.body.data.user).toHaveProperty('last_name');
      });
});