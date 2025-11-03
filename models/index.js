const sequelize = require('../config/database');
const EmployeeModel = require('./employee');
const EnquiryModel = require('./enquiry');

const Employee = EmployeeModel(sequelize);
const Enquiry = EnquiryModel(sequelize);

// Define relationships
Employee.hasMany(Enquiry, {
  foreignKey: 'counselorId',
  as: 'claimedEnquiries'
});

Enquiry.belongsTo(Employee, {
  foreignKey: 'counselorId',
  as: 'counselor'
});

const syncDatabase = async () => {
  try {
    await sequelize.sync({ force: false });
    console.log('Database synchronized successfully');
  } catch (error) {
    console.error('Error syncing database:', error);
  }
};

module.exports = {
  sequelize,
  Employee,
  Enquiry,
  syncDatabase
};