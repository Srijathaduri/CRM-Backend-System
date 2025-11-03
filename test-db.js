const sequelize = require('./config/database');

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');
    
    // Test sync
    await sequelize.sync({ force: false });
    console.log('✅ Database synchronized successfully.');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error.message);
    process.exit(1);
  }
}

testConnection();