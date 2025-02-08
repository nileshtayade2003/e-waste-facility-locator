const express = require('express');
const { loginAdmin, addCenter, deleteCenter, getAllCenters,updateCenter } = require('../controllers/adminController');

const upload = require('../middleware/upload');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Admin login route
router.post('/login', loginAdmin);

// upadate password

// add center
router.post('/add-center',upload.single('image'),authMiddleware, addCenter);

// Get all centers
router.get('/get-centers',authMiddleware,getAllCenters)

// delete center
router.delete('/delete-center/:id',authMiddleware,deleteCenter)

// Update a center
router.patch("/update-center/:id", authMiddleware, upload.single("image"), updateCenter);


module.exports = router;
