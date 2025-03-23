// controllers/userController.js
const Appointment = require('../models/Appointment');
const Center = require('../models/Center');
const User = require('../models/User');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Create a new appointment
exports.createAppointment = async (req, res) => {
    try {
        const { 
            centerId, 
            userId, // Add userId to identify the user
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

        // Validate required fields
        if (!centerId || !userId || !name || !email || !mobileNumber || !address || !productName || !appointmentDate || !appointmentTime) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if the center exists
        const center = await Center.findById(centerId);
        if (!center) {
            return res.status(404).json({ message: 'Center not found' });
        }

        // Check if the user exists (optional, if you have a User model)
        // const user = await User.findById(userId);
        // if (!user) {
        //     return res.status(404).json({ message: 'User not found' });
        // }

        // Create new appointment
        const appointment = new Appointment({
            center: center._id,
            user: userId, // Save userId to identify the user
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


exports.getAppointments = async (req, res) => {
    try {
        const { userId } = req.query; // Get userId from query params
        

        // Fetch appointments for the user
        const appointments = await Appointment.find({ user: userId })
            .populate('center', 'name address') // Populate center details
            .sort({ createdAt: -1 }); // Sort by latest first

     
        res.status(200).json(appointments);
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


exports.registerUser = async (req, res) => {
    try {
        const { name, email, mobile, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "Email already registered!" });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({ name, email, mobile, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

exports.loginUser = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Check if user exists
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ message: "Invalid email or password!" });
  
      // Compare password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: "Invalid email or password!" });
  
      // Generate JWT Token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
  
      res.json({ message: "Login successful!", token, user: { name: user.name, email: user.email } });
    } catch (err) {
      res.status(500).json({ message: "Server Error", error: err.message });
    }
  };

exports.profile = async (req, res) => {
    res.json({ user: req.user });
};




