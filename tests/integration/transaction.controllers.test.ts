import app from '../../app';
import mongoose from 'mongoose';
import request from 'supertest';
import User from '../../models/users.model';
import Account from '../../models/accounts.model';
import Transaction from '../../models/transactions.model';

let senderAccount: string;
let recipientAccount: string;
let authToken: string;

beforeAll(async () => {
    await mongoose.connect("mongodb://localhost:27017/banktest");
    await User.deleteMany({});
    await Account.deleteMany({});
    await Transaction.deleteMany({});
    const res = await request(app)
        .post('/v1/auth/sign-up')
        .send({
            "first_name": "Joseph",
            "last_name": "Anya",
            "email": "joseph@mono.co",
            "password": "12345678"
        });
    authToken = res.body.data.auth_token;
    await request(app)
        .post('/v1/account/create')
        .set('Authorization', `Bearer ${authToken}`)
        .send();
    const accountsRes = await request(app)
        .get('/v1/account')
        .set('Authorization', `Bearer ${authToken}`);
    senderAccount = accountsRes.body.data.accounts[0].account_number;
    recipientAccount = accountsRes.body.data.accounts[1].account_number;
});

describe('transaction endpoints', () => {
    it('should transfer funds between accounts', async () => {
        const res = await request(app)
            .post('/v1/transaction/send')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                "sender_account_number": `${senderAccount}`,
                "recipient_account_number": `${recipientAccount}`,
                "amount": "100000",
                "narration": "happy weekend"
            });
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('message', 'transfer successful');
        const updatedSenderAccount = await Account.findOne({account_number: senderAccount});
        const updatedReceiverAccount = await Account.findOne({account_number: recipientAccount});
        expect(updatedSenderAccount?.balance).toBe(400000);
        expect(updatedReceiverAccount?.balance).toBe(600000);
    });

    it('should not transfer funds if sender has insufficient balance', async () => {
        const res = await request(app)
            .post('/v1/transaction/send')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                "sender_account_number": `${senderAccount}`,
                "recipient_account_number": `${recipientAccount}`,
                "amount": "1000000",
                "narration": "happy weekend"
            });
        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('message', 'insufficient funds');
        const updatedSenderAccount = await Account.findOne({account_number: senderAccount});
        const updatedReceiverAccount = await Account.findOne({account_number: recipientAccount});
        expect(updatedSenderAccount?.balance).toBe(400000);
        expect(updatedReceiverAccount?.balance).toBe(600000);
    });

    it('should get transaction history for an account', async () => {
        const res = await request(app)
          .get(`/v1/transaction/${senderAccount}`)
          .set('Authorization', `Bearer ${authToken}`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body.data.transactions)).toBe(true);
        expect(res.body.data.transactions.length).toBe(1);
      });
})