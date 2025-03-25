const express = require('express');
const { getCenterAppointments, getAppointmentsByStatus, markAppointmentCompleted, rejectAppointment,dashboardDetails,dashboardAnalytics, getCenterCustomers, getCenterDetails, updateCenterDetails, changePassword, uploadImage } = require('../controllers/centerController');
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

// manage an appointment
router.put('/appointments/:id/approve',approveAppointment);
router.put("/reject/:id", rejectAppointment);
router.put("/complete/:appointmentId", markAppointmentCompleted);

//dashboard details
router.get("/dashboard/:id", dashboardDetails);
router.get("/dashboard/analytics/:id", dashboardAnalytics);

//customer details
router.get('/customers/:id',getCenterCustomers)

//center settings
router.get('/center/:id',getCenterDetails)
router.put('/center/:id/update',updateCenterDetails)
router.put('/center/:id/change-password',changePassword)
router.post('/center/:id/upload-image',upload.single('image'),uploadImage)
module.exports = router;

