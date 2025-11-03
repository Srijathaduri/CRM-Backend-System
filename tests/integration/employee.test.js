const request = require('supertest');
const app = require('../../server');
const { Employee } = require('../../models');

describe('Employee API', () => {
  beforeEach(async () => {
    await Employee.destroy({ where: {} });
  });

  describe('POST /api/employees/register', () => {
    it('should register a new employee', async () => {
      const res = await request(app)
        .post('/api/employees/register')
        .send({
          name: 'Test Counselor',
          email: 'test@example.com',
          password: 'password123'
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.email).toBe('test@example.com');
    });

    it('should not register duplicate email', async () => {
      await Employee.create({
        name: 'Existing User',
        email: 'test@example.com',
        password: 'password123'
      });

      const res = await request(app)
        .post('/api/employees/register')
        .send({
          name: 'Test Counselor',
          email: 'test@example.com',
          password: 'password123'
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toContain('already exists');
    });
  });

  describe('POST /api/employees/login', () => {
    beforeEach(async () => {
      await Employee.create({
        name: 'Test Counselor',
        email: 'test@example.com',
        password: 'password123'
      });
    });

    it('should login with valid credentials', async () => {
      const res = await request(app)
        .post('/api/employees/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('token');
    });

    it('should not login with invalid password', async () => {
      const res = await request(app)
        .post('/api/employees/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        });

      expect(res.statusCode).toEqual(401);
    });
  });
});