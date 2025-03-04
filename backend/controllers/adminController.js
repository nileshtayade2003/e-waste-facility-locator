const Admin = require('../models/Admin');
const Center = require('../models/Center');


const {generateToken} = require('../utils/genrateToken')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');



// Admin login controller

exports.loginAdmin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Please provide an email and password' });
    }

    try {
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Generate JWT Token
        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({
            message: 'Login successful',
            token: token
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// adding center
exports.addCenter = async (req, res) => {
    const { name, email, password, phone, address, lat, lng } = req.body;
  
    // Check if an image is uploaded
    const image = req.file ? req.file.filename : null;
  
  
    // Validate required fields
    if (!name || !email || !password || !phone || !address || !lat || !lng) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }
  
    try {
      // Check if center already exists by email
      const existingCenter = await Center.findOne({ email });
      if (existingCenter) {
        return res.status(400).json({ message: 'Center with this email already exists' });
      }
  
      // Hash the password before saving
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      // Create new center
      const center = new Center({
        name,
        email,
        password: hashedPassword,  // Save the hashed password
        phone,
        address,
        lat,
        lng,
        image
      });
  
      // Save the center to the database
      await center.save();
  
      // Return success response
      res.status(201).json({
        message: 'Center added successfully',
        center: {
          _id: center._id,
          name: center.name,
          email: center.email,
          phone: center.phone,
          address: center.address,
          lat: center.lat,
          lng: center.lng,
          image: center.image
        }
      });
    }  catch (error) {
      if (error.response) {
        console.log(error.response.data.message); // Show error message to user
      } else {
        console.log("Error submitting form:", error.message);
      }
    }
    
  };

// get all centers
exports.getAllCenters = async (req, res) => {
    try {
      
        // Fetch all centers from the database
        const centers = await Center.find();

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


// Delete a Center
exports.deleteCenter = async (req, res) => {
    const centerId = req.params.id;

    try {
         // Find the center by ID and delete it
        const center = await Center.findByIdAndDelete(centerId);
        if (!center) {
            return res.status(404).json({ message: 'Center not found' });
        }

        res.status(200).json({ message: 'Center deleted successfully', name:name });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};




// Update Center
exports.updateCenter = async (req, res) => {
  const { id } = req.params; // Get center ID from request parameters
  const { name, email, password, phone, address, lat, lng } = req.body;

  // Check if a new image is uploaded
  const image = req.file ? req.file.filename : null;

  try {
    // Find the center by ID
    let center = await Center.findById(id);
    if (!center) {
      return res.status(404).json({ message: "Center not found" });
    }

    // If updating email, check if it already exists
    if (email && email !== center.email) {
      const existingCenter = await Center.findOne({ email });
      if (existingCenter) {
        return res.status(400).json({ message: "Center with this email already exists" });
      }
    }

    // Hash the new password if provided
    let hashedPassword = center.password; // Keep old password if not updating
    if (password) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);
    }

    // Update the center fields
    center.name = name || center.name;
    center.email = email || center.email;
    center.password = hashedPassword;
    center.phone = phone || center.phone;
    center.address = address || center.address;
    center.lat = lat || center.lat;
    center.lng = lng || center.lng;
    if (image) center.image = image; // Only update image if a new one is uploaded

    // Save the updated center
    await center.save();

    res.status(200).json({
      message: "Center updated successfully",
      center: {
        _id: center._id,
        name: center.name,
        email: center.email,
        phone: center.phone,
        address: center.address,
        lat: center.lat,
        lng: center.lng,
        image: center.image,
      },
    });
  } catch (error) {
    console.error("Error updating center:", error.message);
    res.status(500).json({ message: "Server error, please try again later" });
  }
};

