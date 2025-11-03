const { sequelize, syncDatabase } = require('../models');

beforeAll(async () => {
  // Use test database
  if (process.env.NODE_ENV === 'test') {
    await syncDatabase();
  }
});

afterAll(async () => {
  await sequelize.close();
});