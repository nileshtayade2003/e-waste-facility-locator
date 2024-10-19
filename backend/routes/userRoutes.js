const express = require('express');
const { createAppointment } = require('../controllers/userController');
const router = express.Router();

// Route to create a new appointment
router.post('/book-appointment', createAppointment);

module.exports = router;