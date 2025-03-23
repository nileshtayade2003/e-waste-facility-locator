const express = require('express');
const { createAppointment,getAllCenters,registerUser,loginUser,profile, getAppointments } = require('../controllers/userController');
const upload = require('../middleware/upload');
const userAuthMiddleware = require('../middleware/userAuthMiddleware');
const router = express.Router();

// Route to create a new appointment
router.post('/book-appointment',upload.single('productPhoto'),createAppointment);
router.get('/get-centers', getAllCenters);
router.get('/appointments',getAppointments);
router.post('/register',registerUser)
router.post('/login',loginUser)
router.get('/profile',userAuthMiddleware,profile)

module.exports = router;