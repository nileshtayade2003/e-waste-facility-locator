// controllers/userController.js
const Appointment = require('../models/Appointment');
const Center = require('../models/Center');


// Create a new appointment
exports.createAppointment = async (req, res) => {
    try {
        const { 
            centerId, 
            name, 
            email, 
            mobileNumber, 
            address, 
            productName, 
            appointmentDate, 
            appointmentTime 
        } = req.body;

        // Extract uploaded file path
        const productPhoto = req.file ? req.file.path : null;

        // Check if the center exists
        const center = await Center.findById(centerId);
        if (!center) {
            return res.status(404).json({ message: 'Center not found' });
        }

        // Create new appointment
        const appointment = new Appointment({
            center: center._id,
            name,
            email,
            mobileNumber,
            address,
            productName,
            appointmentDate,
            appointmentTime,
            productPhoto
        });

        // Save appointment
        await appointment.save();

        res.status(201).json({ message: 'Appointment created successfully', appointment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


// get all centers
exports.getAllCenters = async (req, res) => {
    try {
      
        // Fetch all centers from the database
        const centers = await Center.find().select('-password');

        // Check if there are any centers
        if (centers.length === 0) {
            return res.status(404).json({ message: 'No centers found' });
        }

        // Send the response with the list of centers
        res.status(200).json(centers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

