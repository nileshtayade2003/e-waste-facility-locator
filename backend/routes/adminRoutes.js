const express = require('express');
const { loginAdmin, addCenter, deleteCenter, getAllCenters } = require('../controllers/adminController');

const upload = require('../middleware/upload');
const router = express.Router();

// Admin login route
router.post('/login', loginAdmin);

// upadate password

// add center
router.post('/add-center', upload.single('image'), addCenter);

// Get all centers
router.get('/get-centers',getAllCenters)

// delete center
router.delete('/delete-center/:id',deleteCenter)

module.exports = router;
