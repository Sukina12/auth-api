'use strict';
const supergoose = require('@code-fellows/supergoose');
const server = require('../src/server');
const mockReq = supergoose(server.app);

require('dotenv').config();

describe('admin', () => {
  let token;
  let id;

  it('sign up', async () => {
    const res = await mockReq.post('/signup').send({ username: 'test', password: 'test', role: 'admin' });
    expect(res.status).toEqual(201);
  });

  it('sign in', async () => {
    const res = await mockReq.post('/signin').auth('test', 'test');
    token = res.body.token;
    expect(res.status).toEqual(200);
    expect(res.body.user.role).toEqual('admin');
    expect(res.body.token).toEqual(token);
  });

  it('POST', async () => {
    const res = await mockReq.post('/api/v1/food').send({
      name: 'Salad',
      calories: 60,
      type: 'vegetable',
    }).set({ Authorization: `Bearer ${token}` });
    expect(res.status).toEqual(201);
    expect(res.body._id).toBeDefined();
    expect(res.body.name).toEqual('Salad');
    expect(res.body.type).toEqual('VEGETABLE');
    id = res.body._id;
  });

  it('GET all', async () => {
    const res = await mockReq.get('/api/v1/food');
    expect(res.status).toEqual(200);
    expect(res.body[0]._id).toBeDefined();
    expect(res.body[0].name).toEqual('Salad');
    expect(res.body[0].type).toEqual('VEGETABLE');
    expect(res.body.length).toEqual(1);
  });

  it('GET one', async () => {
    const res = await mockReq.get(`/api/v1/food/${id}`);
    expect(res.status).toEqual(200);
    expect(res.body._id).toBeDefined();
    expect(res.body.name).toEqual('Salad');
    expect(res.body.type).toEqual('VEGETABLE');
    expect(res.body._id).toEqual(id);
  });

  it('PUT', async () => {
    const res = await mockReq.put(`/api/v1/food/${id}`).send({
      name: 'Fruit Salad',
      calories: 500,
      type: 'fruit',
    }).set({ 'Authorization': `Bearer ${token}` });
    expect(res.status).toEqual(200);
    expect(res.body._id).toBeDefined();
    expect(res.body.name).toEqual('Fruit Salad');
    expect(res.body.type).toEqual('FRUIT');
    expect(res.body.calories).not.toEqual(60);
    expect(res.body._id).toEqual(id);
  });

  it('DELETE', async () => {
    const res = await mockReq.delete(`/api/v1/food/${id}`).set({ 'Authorization': `Bearer ${token}` });
    expect(res.status).toEqual(200);
    const res1 = await mockReq.get(`/api/v1/food/${id}`);
    expect(res1.status).toEqual(200);
    expect(res1.body).toEqual(null);
    const res2 = await mockReq.get('/api/v1/food/');
    expect(res2.body.length).toEqual(0);
  });
});
