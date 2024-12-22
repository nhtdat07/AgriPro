const request = require('supertest');
const app = require('../src/app');

describe('GET /', () => {
    it('should return a welcome message', async () => {
        const res = await request(app).get('/');
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('Welcome to AgriPro Backend');
    });
});
