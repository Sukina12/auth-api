'use strict';
const supergoose = require('@code-fellows/supergoose');
const server = require('../src/server');
const mockReq = supergoose(server.server);

process.env.SECRET = 'yariyariyari';

require('dotenv').config();

let users = {
  admin: { username: 'test1', password: 'test', role: 'admin' },
  editor: { username: 'test2', password: 'test', role: 'editor' },
  user: { username: 'test3', password: 'test', role: 'user' },
};

describe('sign-up sign-in', () => {
  Object.keys(users).forEach(user => {
    it('sign up', async () => {
      const res = await mockReq.post('/signup').send(users[user]);
      expect(res.status).toEqual(201);
      expect(res.body.token).toBeDefined();
      expect(res.body.user._id).toBeDefined();
      expect(res.body.user.username).toEqual(users[user].username);
    });

    it('sign in', async () => {
      const res = await mockReq.post('/signin').auth(users[user].username, users[user].password);
      expect(res.status).toEqual(200);
      expect(res.body.token).toBeDefined();
      expect(res.body.user._id).toBeDefined();
      expect(res.body.user.username).toEqual(users[user].username);
    });
  });
});

let token;

describe('/users && secret', () => {
  it('/secret', async () => {
    const res = await mockReq.post('/signin').auth(users.user.username, users.user.password);
    token = res.body.token;
    const res2 = await mockReq.get('/secret').set(`Authorization`, `Bearer ${token}`);
    expect(res2.status).toEqual(200);
    expect(res2.text).toEqual('Welcome to the secret area');
  });

  it('/users', async () => {
    const res1 = await mockReq.post('/signin').auth(users.admin.username, users.admin.password);
    token = res1.body.token;
    const res = await mockReq.get('/users').set({Authorization : `Bearer ${token}`});
    expect(res.status).toEqual(200);
    expect(res.body.length).toEqual(3);
  });
});
