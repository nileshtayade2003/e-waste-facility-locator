// controllers/userController.js
const Appointment = require('../models/Appointment');
const Center = require('../models/Center');

// Create a new appointment
exports.createAppointment = async (req, res) => {
    const { centerId, customerName, customerEmail, appointmentDate, phone } = req.body;

    try {
        // Check if the center exists
        const center = await Center.findById(centerId);
        if (!center) {
            return res.status(404).json({ message: 'Center not found' });
        }

        // Create new appointment
        const appointment = new Appointment({
            center: center._id,
            customerName,
            customerEmail,
            appointmentDate,
            phone
        });

        // Save appointment
        await appointment.save();

        res.status(201).json({ message: 'Appointment created successfully', appointment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};