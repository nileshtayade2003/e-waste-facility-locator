const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const Admin = require('../models/Admin');  // Assuming your Admin model is in ../models/Admin.js

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch((err) => console.log(err));

const createAdmin = async () => {
    const email = "admin@gmail.com"; // Replace with your admin email
    const password = "admin"; // Replace with your desired password

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
        console.log('Admin already exists');
        return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new admin
    const admin = new Admin({
        email,
        password: hashedPassword,
    });

    await admin.save();
    console.log('Admin created successfully');
    mongoose.disconnect();
};

createAdmin();
