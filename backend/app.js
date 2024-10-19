const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');  // Import the DB connection function
const adminRoutes = require('./routes/adminRoutes');  // Admin routes
const centerRoutes = require('./routes/centerRoutes');  // Admin routes
const userRoutes = require('./routes/userRoutes');  // Admin routes
// const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Load environment variables
require('dotenv').config();


// Connect to MongoDB
connectDB();

const app = express();

// Middleware to parse incoming JSON requests
app.use(express.json());
// to make files publically access
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/admin', adminRoutes);  // Admin routes
app.use('/api/center', centerRoutes);  // Admin routes
app.use('/api/user', userRoutes);  // Admin routes



// Set up the server to listen on the PORT from .env
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
