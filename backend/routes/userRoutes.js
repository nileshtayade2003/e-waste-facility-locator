const express = require('express');
const { createAppointment,getAllCenters } = require('../controllers/userController');
const upload = require('../middleware/upload');
const router = express.Router();

// Route to create a new appointment
router.post('/book-appointment',upload.single('productPhoto'),createAppointment);
router.get('/get-centers', getAllCenters);

module.exports = router;