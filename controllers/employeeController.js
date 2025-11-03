const jwt = require('jsonwebtoken');
const { Employee } = require('../models');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '30d',
  });
};

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const employeeExists = await Employee.findOne({ where: { email } });
    if (employeeExists) {
      return res.status(400).json({ message: 'Employee already exists' });
    }

    const employee = await Employee.create({
      name,
      email,
      password
    });

    res.status(201).json({
      id: employee.id,
      name: employee.name,
      email: employee.email,
      token: generateToken(employee.id)
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const employee = await Employee.findOne({ where: { email } });
    if (employee && (await employee.validatePassword(password))) {
      res.json({
        id: employee.id,
        name: employee.name,
        email: employee.email,
        token: generateToken(employee.id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const employee = await Employee.findByPk(req.employee.id);
    res.json(employee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};