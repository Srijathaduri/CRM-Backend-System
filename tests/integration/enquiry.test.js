const request = require('supertest');
const app = require('../../server');
const { Employee, Enquiry } = require('../../models');

describe('Enquiry API', () => {
  let authToken;

  beforeEach(async () => {
    await Employee.destroy({ where: {} });
    await Enquiry.destroy({ where: {} });

    // Create test employee and get token
    const employee = await Employee.create({
      name: 'Test Counselor',
      email: 'test@example.com',
      password: 'password123'
    });

    const loginRes = await request(app)
      .post('/api/employees/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });

    authToken = loginRes.body.token;
  });

  describe('POST /api/enquiries', () => {
    it('should create enquiry without authentication', async () => {
      const res = await request(app)
        .post('/api/enquiries')
        .send({
          name: 'Test Student',
          email: 'student@example.com',
          courseInterest: 'Web Development'
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body.enquiry.name).toBe('Test Student');
      expect(res.body.enquiry.claimed).toBe(false);
    });
  });

  describe('GET /api/enquiries/public', () => {
    it('should get public enquiries with authentication', async () => {
      // Create test enquiries
      await Enquiry.create({
        name: 'Public Student',
        email: 'public@example.com',
        courseInterest: 'Web Development',
        claimed: false
      });

      const res = await request(app)
        .get('/api/enquiries/public')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body[0].claimed).toBe(false);
    });

    it('should not get public enquiries without authentication', async () => {
      const res = await request(app)
        .get('/api/enquiries/public');

      expect(res.statusCode).toEqual(401);
    });
  });

  describe('PUT /api/enquiries/:id/claim', () => {
    it('should claim an enquiry', async () => {
      // Create a public enquiry
      const enquiry = await Enquiry.create({
        name: 'Test Student',
        email: 'student@example.com',
        courseInterest: 'Web Development',
        claimed: false
      });

      const res = await request(app)
        .put(`/api/enquiries/${enquiry.id}/claim`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.enquiry.claimed).toBe(true);
    });
  });

  describe('GET /api/enquiries/private', () => {
    it('should get private enquiries for logged-in counselor', async () => {
      // Get employee ID from token
      const employee = await Employee.findOne({ where: { email: 'test@example.com' } });

      // Create claimed enquiry
      await Enquiry.create({
        name: 'Private Student',
        email: 'private@example.com',
        courseInterest: 'Web Development',
        claimed: true,
        counselorId: employee.id
      });

      const res = await request(app)
        .get('/api/enquiries/private')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body[0].claimed).toBe(true);
    });
  });
});