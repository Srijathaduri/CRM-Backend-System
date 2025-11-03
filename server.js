const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const { syncDatabase } = require('./models');
const employeeRoutes = require('./routes/employeeRoutes');
const enquiryRoutes = require('./routes/enquiryRoutes');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

// Routes
app.use('/api/employees', employeeRoutes);
app.use('/api/enquiries', enquiryRoutes);


// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: '🚀 CRM Backend API is running!',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/health',
      submit_enquiry: 'POST /api/enquiries',
      public_enquiries: 'GET /api/enquiries/public',
      private_enquiries: 'GET /api/enquiries/private',
      claim_enquiry: 'PUT /api/enquiries/:id/claim',
      register: 'POST /api/employees/register',
      login: 'POST /api/employees/login'
    },
    documentation: 'Check README for API details'
  });
}); 
// Health check
app.get('/health', (req, res) => {
  res.json({ message: 'CRM Backend is running!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

// Initialize database and start server
syncDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

module.exports = app;