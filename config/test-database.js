const { Sequelize } = require('sequelize');

const testSequelize = new Sequelize({
  dialect: 'sqlite',
  storage: ':memory:', // Use in-memory SQLite for tests
  logging: false
});

module.exports = testSequelize;