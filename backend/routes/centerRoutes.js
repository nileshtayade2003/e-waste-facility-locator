const express = require('express');
const { getCenterAppointments } = require('../controllers/centerController');
const { loginCenter } = require('../controllers/centerController');
const { updateProfile } = require('../controllers/centerController');
const { approveAppointment } = require('../controllers/centerController');
const upload = require('../middleware/upload');  // Multer configuration for handling file uploads
const router = express.Router();


//Center login route
router.post('/login',loginCenter)

// Route to get all appointments for a specific center
router.get('/:centerId/appointments', getCenterAppointments);

// Update center profile
router.put('/update-center/:id', upload.single('image'), updateProfile);

// approve an appointment
router.patch('/appointments/:appointmentId/approve', approveAppointment);

module.exports = router;

