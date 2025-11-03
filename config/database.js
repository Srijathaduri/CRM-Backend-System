const { Sequelize } = require('sequelize');
require('dotenv').config();

console.log('Environment:', process.env.NODE_ENV);
console.log('Database URL available:', !!process.env.DATABASE_URL);

let sequelize;

// Production - use DATABASE_URL from Render PostgreSQL
if (process.env.NODE_ENV === 'production' || process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: console.log, // Enable to see SQL queries
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  });
} 
// Development - use local PostgreSQL
else {
  sequelize = new Sequelize(
    process.env.DB_NAME || 'crmdb',
    process.env.DB_USER || 'postgres',
    process.env.DB_PASS || 'password',
    {
      host: process.env.DB_HOST || 'localhost',
      dialect: 'postgres',
      port: process.env.DB_PORT || 5432,
      logging: console.log
    }
  );
}

module.exports = sequelize;