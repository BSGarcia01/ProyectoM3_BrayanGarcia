
const request = require('supertest');
const app = require('../app'); // o la forma que uses

it('debe responder GET /api con 200', async () => {
  const res = await request(app).get('/api');
  expect(res.status).toBe(200);
});