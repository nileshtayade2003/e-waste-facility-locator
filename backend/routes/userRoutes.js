const express = require('express');
const { createAppointment,getAllCenters,registerUser,loginUser,profile, getAppointments, getAvailableProducts, razorpayPayment, updateOrderDetails, yourPurchases } = require('../controllers/userController');
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
router.get('/products', getAvailableProducts); // Get all available products
router.post('/razorpay/order', razorpayPayment); // Get all available products
router.post('/update-product-order', updateOrderDetails); // Get all available products
router.get('/purchases/:userId', yourPurchases); // Get all available products

module.exports = router;