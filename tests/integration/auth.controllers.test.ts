import app from '../../app';
import mongoose from 'mongoose';
import request from 'supertest';
import User from '../../models/users.model';

beforeAll(async () => {
    await mongoose.connect("mongodb://localhost:27017/banktest");
    await User.deleteMany({});
});

describe('auth endpoints', () => {
    it('should create a user', async () => {
        const res = await request(app)
            .post('/v1/auth/sign-up')
            .send({
                "first_name": "Joseph",
                "last_name": "Anya",
                "email": "joseph@mono.co",
                "password": "12345678"
            });
        expect(res.status).toBe(201);
        expect(res.body.data).toHaveProperty('auth_token');
    })

    it('should log the user in', async () => {
        const res = await request(app)
            .post('/v1/auth/login')
            .send({
                "email": "joseph@mono.co",
                "password": "12345678"
            })
        expect(res.status).toBe(200);
        expect(res.body.data).toHaveProperty('auth_token');
    })

    it('should not log the user in with a wrong password', async () => {
        const res = await request(app)
            .post('/v1/auth/login')
            .send({
                "email": "joseph@mono.co",
                "password": "wrongpass"
            })
        expect(res.body).toHaveProperty('message', 'invalid password');
    })
}) 