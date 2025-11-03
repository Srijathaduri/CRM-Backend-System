const express = require('express');
const { 
  createEnquiry, 
  getPublicEnquiries, 
  getPrivateEnquiries, 
  claimEnquiry, 
  getStats 
} = require('../controllers/enquiryController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

// Public route (no authentication needed)
router.post('/', createEnquiry);

// Protected routes (require employee authentication)
router.get('/public', protect, getPublicEnquiries);
router.get('/private', protect, getPrivateEnquiries);
router.put('/:id/claim', protect, claimEnquiry);
router.get('/stats', protect, getStats);

module.exports = router;