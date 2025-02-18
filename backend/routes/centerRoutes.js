const express = require('express');
const { getCenterAppointments, getAppointmentsByStatus } = require('../controllers/centerController');
const { loginCenter } = require('../controllers/centerController');
const { updateProfile } = require('../controllers/centerController');
const { approveAppointment } = require('../controllers/centerController');
const upload = require('../middleware/upload');  // Multer configuration for handling file uploads
const router = express.Router();


//Center login route
router.post('/login',loginCenter)

// Route to get all appointments for a specific center
router.get('/:centerId/appointments', getCenterAppointments);

// get appointment by status :pending,approved,rejected,completed
router.get('/appointments/:centerId/:status',getAppointmentsByStatus);


// Update center profile
router.put('/update-center/:id', upload.single('image'), updateProfile);

// approve an appointment
router.patch('/appointments/:appointmentId/approve', approveAppointment);

module.exports = router;

