import { expect } from 'chai';
import request from 'supertest';
import {app} from '../../src/index';
import { v4 as uuidv4 } from 'uuid';

describe('UserController Tests', function () {
  let userToken: string;
  let adminToken: string;
  let userId: string;
  let adminId: string;
  const testEmail = `${uuidv4()}@test.com`;
  const testAdminEmail = `${uuidv4()}@test.com`;
  const testPassword = 'Test@1234';
  const newPassword = 'NewPass@1234';

  before(async function () {
    // Sign up a user and an admin
    const userRes = await request(app)
      .post('/signup')
      .send({
        firstName: 'TestUser',
        lastName: 'User',
        email: testEmail,
        password: testPassword,
      });

    expect(userRes.status).to.equal(201);
    userToken = userRes.body.data.token;
    userId = userRes.body.data.id;

    const adminRes = await request(app)
      .post('/signupAdmin')
      .send({
        firstName: 'TestAdmin',
        lastName: 'Admin',
        email: testAdminEmail,
        password: testPassword,
      });

    expect(adminRes.status).to.equal(201);
    adminToken = adminRes.body.data.token;
    adminId = adminRes.body.data.id;
  });

  describe('Login Tests', function () {
    it('should login a user successfully', async function () {
      const res = await request(app)
        .post('/login')
        .send({ email: testEmail, password: testPassword });

      expect(res.status).to.equal(200);
      expect(res.body.data).to.have.property('token');
    });

    it('should login an admin successfully', async function () {
      const res = await request(app)
        .post('/loginAdmin')
        .send({ email: testAdminEmail, password: testPassword });

      expect(res.status).to.equal(200);
      expect(res.body.data).to.have.property('token');
    });
  });

  describe('Forget Password Tests', function () {
    it('should generate a reset token for user', async function () {
      const res = await request(app)
        .post('/forget-password')
        .send({ email: testEmail });

      expect(res.status).to.equal(200);
      expect(res.body.data).to.have.property('reset_token');
    });

    it('should generate a reset token for admin', async function () {
      const res = await request(app)
        .post('/forget-passwordAdmin')
        .send({ email: testAdminEmail });

      expect(res.status).to.equal(200);
      expect(res.body.data).to.have.property('reset_token');
    });
  });

  describe('Reset Password Tests', function () {
    let resetTokenUser: string;
    let resetTokenAdmin: string;

    before(async function () {
      const userRes = await request(app)
        .post('/forget-password')
        .send({ email: testEmail });

      resetTokenUser = userRes.body.data.reset_token;

      const adminRes = await request(app)
        .post('/forget-passwordAdmin')
        .send({ email: testAdminEmail });

      resetTokenAdmin = adminRes.body.data.reset_token;
    });

    it('should reset the password for user', async function () {
      const res = await request(app)
        .post('/reset-password')
        .set('Authorization', `Bearer ${resetTokenUser}`)
        .send({ newPassword });

      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal('Password has been changed successfully');
    });

    it('should reset the password for admin', async function () {
      const res = await request(app)
        .post('/reset-passwordAdmin')
        .set('Authorization', `Bearer ${resetTokenAdmin}`)
        .send({ newPassword });

      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal('Password has been changed successfully');
    });
  });
});
