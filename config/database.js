const { Sequelize } = require('sequelize');
require('dotenv').config();

let sequelize;

// Use SQLite on Render (ephemeral storage)
if (process.env.NODE_ENV === 'production') {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: '/tmp/database.sqlite', // Use /tmp directory on Render
    logging: false
  });
} else {
  // Local development with PostgreSQL
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
      host: process.env.DB_HOST,
      dialect: 'postgres',
      port: process.env.DB_PORT || 5432,
      logging: false
    }
  );
}

module.exports = sequelize;