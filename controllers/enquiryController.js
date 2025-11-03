const { Enquiry, Employee } = require('../models');

// Create new enquiry (public form submission)
exports.createEnquiry = async (req, res) => {
  try {
    const { name, email, courseInterest } = req.body;

    const enquiry = await Enquiry.create({
      name,
      email,
      courseInterest,
      claimed: false,
      counselorId: null
    });

    res.status(201).json({
      message: 'Enquiry submitted successfully',
      enquiry
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all public (unclaimed) enquiries
exports.getPublicEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.findAll({
      where: { claimed: false },
      include: [{
        model: Employee,
        as: 'counselor',
        attributes: ['id', 'name', 'email']
      }],
      order: [['createdAt', 'DESC']]
    });

    res.json(enquiries);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get private enquiries for logged-in counselor
exports.getPrivateEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.findAll({
      where: { 
        claimed: true,
        counselorId: req.employee.id
      },
      include: [{
        model: Employee,
        as: 'counselor',
        attributes: ['id', 'name', 'email']
      }],
      order: [['createdAt', 'DESC']]
    });

    res.json(enquiries);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Claim an enquiry
exports.claimEnquiry = async (req, res) => {
  try {
    const { id } = req.params;

    const enquiry = await Enquiry.findByPk(id);
    if (!enquiry) {
      return res.status(404).json({ message: 'Enquiry not found' });
    }

    if (enquiry.claimed) {
      return res.status(400).json({ message: 'Enquiry already claimed' });
    }

    enquiry.claimed = true;
    enquiry.counselorId = req.employee.id;
    await enquiry.save();

    // Fetch the updated enquiry with counselor details
    const updatedEnquiry = await Enquiry.findByPk(id, {
      include: [{
        model: Employee,
        as: 'counselor',
        attributes: ['id', 'name', 'email']
      }]
    });

    res.json({
      message: 'Enquiry claimed successfully',
      enquiry: updatedEnquiry
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get enquiry statistics
exports.getStats = async (req, res) => {
  try {
    const totalEnquiries = await Enquiry.count();
    const publicEnquiries = await Enquiry.count({ where: { claimed: false } });
    const myEnquiries = await Enquiry.count({ 
      where: { 
        claimed: true,
        counselorId: req.employee.id
      } 
    });

    res.json({
      totalEnquiries,
      publicEnquiries,
      myEnquiries
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};