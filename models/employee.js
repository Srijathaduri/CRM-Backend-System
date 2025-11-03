const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
  const Employee = sequelize.define('Employee', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'employees',
    timestamps: true,
    hooks: {
      beforeCreate: async (employee) => {
        employee.password = await bcrypt.hash(employee.password, 12);
      },
      beforeUpdate: async (employee) => {
        if (employee.changed('password')) {
          employee.password = await bcrypt.hash(employee.password, 12);
        }
      }
    }
  });

  Employee.prototype.validatePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
  };

  Employee.prototype.toJSON = function() {
    const values = { ...this.get() };
    delete values.password;
    return values;
  };

  return Employee;
};