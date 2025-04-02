// controllers/centerController.js
const Appointment = require("../models/Appointment");
const Center = require("../models/Center");
const Product = require('../models/Product');
const { sendEmail } = require("../utils/email"); // Import email utility
const { generateToken } = require("../utils/genrateToken");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const path = require('path');
const fs = require('fs');


//Center login controller
exports.loginCenter = async (req, res) => {
  const { email, password } = req.body;

  // Validate the input
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Please provide an email and password" });
  }

  try {
    // Find center by email
    const center = await Center.findOne({ email });
    if (!center) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(password, center.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate JWT Token
    const token = generateToken(center._id);

    // Send response with the token
    res.json({
      _id: center._id,
      email: center.email,
      token: token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all appointments for a center
exports.getCenterAppointments = async (req, res) => {
  const centerId = req.params.centerId; // Get center ID from URL params

  try {
    // Find all appointments for the center
    const appointments = await Appointment.find({ center: centerId }).sort({createdAt:-1});

    res.status(200).json({
      success: true,
      count: appointments.length,
      appointments,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

//get appointments by status
exports.getAppointmentsByStatus = async (req, res) => {
  const { centerId, status } = req.params; // Get centerId and status from URL params

  try {
    // Validate status
    const validStatuses = ["pending", "approved", "completed", "rejected"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    // Fetch appointments with the given status for the specified center
    const appointments = await Appointment.find({ center: centerId, status });

    res.status(200).json({
      success: true,
      count: appointments.length,
      appointments,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// Update Center Profile
exports.updateProfile = async (req, res) => {
  const centerId = req.params.id;
  const { name, email, phone, address, lat, lng, oldPassword, newPassword } =
    req.body;

  try {
    // Find the center by ID
    let center = await Center.findById(centerId);
    if (!center) {
      return res.status(404).json({ message: "Center not found" });
    }

    // Update fields
    center.name = name || center.name;
    center.email = email || center.email;
    center.phone = phone || center.phone;
    center.address = address || center.address;
    center.lat = lat || center.lat;
    center.lng = lng || center.lng;

    // Check if a new image is uploaded
    if (req.file) {
      center.image = req.file.path;
    }

    // If password update is requested
    if (newPassword) {
      // Check if old password is provided
      if (!oldPassword) {
        return res
          .status(400)
          .json({ message: "Old password is required to change the password" });
      }

      // Compare the old password with the current password in the database
      const isMatch = await bcrypt.compare(oldPassword, center.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Old password is incorrect" });
      }

      // If old password is correct, hash the new password
      const salt = await bcrypt.genSalt(10);
      center.password = await bcrypt.hash(newPassword, salt);
    }

    // Save the updated center
    await center.save();

    res
      .status(200)
      .json({ message: "Center profile updated successfully", center });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Approve appointment
exports.approveAppointment = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the appointment by its ID
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    //if already approved
    if (appointment.status == "approved") {
      return res.status(200).json({ message: "appointment already approved" });
    }

    // Update appointment status to 'approved'
    appointment.status = "approved";
    await appointment.save();

    //find center
    const center = await Center.findById(appointment.center);

    // Send approval email to the user
    const userEmail = {
      to: appointment.email, // assuming you store the user's email in appointment.userEmail
      subject: "Appointment Approved",
      html: `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Appointment Confirmation</title>
                <style>
                    body {
                        font-family: 'Arial', sans-serif;
                        background-color: #f4f4f4;
                        margin: 0;
                        padding: 0;
                    }
                    .email-container {
                        max-width: 600px;
                        margin: 0 auto;
                        background-color: #ffffff;
                        border-radius: 10px;
                        overflow: hidden;
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    }
                    .header {
                        background-color: #4CAF50;
                        padding: 20px;
                        text-align: center;
                        color: #fff;
                    }
                    .header h1 {
                        margin: 0;
                        font-size: 24px;
                    }
                    .content {
                        padding: 20px;
                        text-align: left;
                        color: #333;
                    }
                    .content p {
                        font-size: 16px;
                        line-height: 1.6;
                    }
                    .content .appointment-details {
                        background-color: #f9f9f9;
                        border-left: 4px solid #4CAF50;
                        padding: 15px;
                        margin: 20px 0;
                    }
                    .content .appointment-details p {
                        margin: 0;
                        font-weight: bold;
                    }
                    .footer {
                        background-color: #4CAF50;
                        padding: 10px;
                        text-align: center;
                        color: #fff;
                        font-size: 14px;
                    }
                    .button {
                        display: inline-block;
                        background-color: #4CAF50;
                        color: white;
                        padding: 10px 20px;
                        text-decoration: none;
                        border-radius: 5px;
                        margin-top: 20px;
                    }
                </style>
            </head>
            <body>
                <div class="email-container">
                    <!-- Header -->
                    <div class="header">
                        <h1>Appointment Confirmed</h1>
                    </div>
                    
                    <!-- Content -->
                    <div class="content">
                        <p>Hello <strong>${appointment.name}</strong>,</p>
                        <p>Your appointment with <strong>${center.name}</strong> has been approved. We look forward to serving you!</p>
                        
                        <div class="appointment-details">
                            <p>Date: <span>${appointment.appointmentDate}</span></p>
                        </div>

                        <p>Thank you for choosing our service! If you have any questions, feel free to reply to this email.</p>

                        
                    </div>
                    
                    <!-- Footer -->
                    <div class="footer">
                        <p>&copy; 2024 E waste facility locator. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
            `,
    };

    // Use email utility to send the email
    await sendEmail(userEmail);

    res.status(200).json({ message: "Appointment approved and email sent",success:true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Reject Appointment
exports.rejectAppointment = async (req, res) => {
  const { id } = req.params;
  const { rejectionReason } = req.body;

  try {
    // Find the appointment
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Ensure it's not already rejected
    if (appointment.status === "rejected") {
      return res.status(400).json({ message: "Appointment is already rejected" });
    }

    const center = await Center.findById(appointment.center);

    // Update the appointment status
    appointment.status = "rejected";
    appointment.rejectionReason = rejectionReason;
    await appointment.save();

    // Send rejection email
    const rejectionEmail = {
      to: appointment.email,
      subject: "Appointment Rejected",
      html: `
        <p>Dear <strong>${appointment.name}</strong>,</p>
        <p>We regret to inform you that your appointment at <strong>${center.name}</strong> has been rejected.</p>
        <p><strong>Reason:</strong> ${rejectionReason}</p>
        <p>If you have any questions, please contact us.</p>
      `,
    };
    await sendEmail(rejectionEmail);

    res.status(200).json({ message: "Appointment rejected and email sent",success:true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Mark Appointment as Completed
exports.markAppointmentCompleted = async (req, res) => {
  const { appointmentId } = req.params;
  const { amountPaid } = req.body;

  try {
    // Find the appointment
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Ensure it's not already completed
    if (appointment.status === "completed") {
      return res.status(400).json({ message: "Appointment is already completed" });
    }

    // Update appointment status and store amount paid
    appointment.status = "completed";
    appointment.amountPaid = amountPaid;
    await appointment.save();

    const center =await Center.findById(appointment.center)

    // Send completion email
    const completionEmail = {
      to: appointment.email,
      subject: "Appointment Completed",
      html: `
        <p>Dear <strong>${appointment.name}</strong>,</p>
        <p>We are pleased to inform you that your appointment at <strong>${center.name}</strong> has been successfully completed.</p>
        <p><strong>Amount Paid:</strong> ₹${amountPaid}</p>
        <p>Thank you for choosing our service!</p>
      `,
    };
    await sendEmail(completionEmail);

    res.status(200).json({ message: "Appointment marked as completed and email sent",success:true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


// dashboard details
exports.dashboardDetails = async (req, res) => {
  try {
    const centerId = req.params.id;

    // Total Appointments
    const totalAppointments = await Appointment.countDocuments({ center: centerId });

    // Count by status
    const pendingAppointments = await Appointment.countDocuments({ center: centerId, status: "pending" });
    const completedAppointments = await Appointment.countDocuments({ center: centerId, status: "completed" });
    const rejectedAppointments = await Appointment.countDocuments({ center: centerId, status: "rejected" });

    // Unique customers who booked appointments at this center
    const uniqueCustomers = await Appointment.distinct("user", { center: centerId });
    const totalCustomers = uniqueCustomers.length;

    // Get recent appointments (latest 5)
    const recentAppointments = await Appointment.find({ center: centerId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "name");

    res.json({
      totalAppointments,
      pendingAppointments,
      completedAppointments,
      rejectedAppointments,
      totalCustomers,
      recentAppointments
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// Dashboard Analytics Controller
exports.dashboardAnalytics = async (req, res) => {
  try {
    const centerId = new mongoose.Types.ObjectId(req.params.id); // Convert to ObjectId

    // 🟢 Aggregate Monthly Appointments by Month
    const monthlyStats = await Appointment.aggregate([
      { $match: { center: centerId } }, // Filter by center
      {
        $group: {
          _id: { $month: "$appointmentDate" }, // Group by month
          total: { $sum: 1 }, // Count total appointments
          pending: { $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] } },
          completed: { $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] } },
          rejected: { $sum: { $cond: [{ $eq: ["$status", "rejected"] }, 1, 0] } },
        },
      },
      { $sort: { _id: 1 } }, // Sort by month
    ]);

    // 🟢 Count Total Appointments Per Status
    const statusCount = await Appointment.aggregate([
      { $match: { center: centerId } }, // Filter by center
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }, // Count by status
        },
      },
    ]);


    res.json({ monthlyStats, statusCount });
  } catch (error) {
    console.error("❌ Error fetching analytics:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// customers details
// Get All Customers Who Took Appointments for a Specific Center
exports.getCenterCustomers = async (req, res) => {
  try {
    const centerId = new mongoose.Types.ObjectId(req.params.id); // Convert to ObjectId

    // Find all appointments for the center and populate user details
    const appointments = await Appointment.find({ center: centerId }).populate("user", "name email mobile");

    // Extract unique users
    const customers = [];
    const seenUsers = new Set();

    appointments.forEach((appointment) => {
      if (appointment.user && appointment.user._id) { // Ensure user exists
        const userId = appointment.user._id.toString();
        if (!seenUsers.has(userId)) {
          seenUsers.add(userId);
          customers.push(appointment.user);
        }
      }
    });

    res.status(200).json({ success: true, customers });
  } catch (error) {
    console.error("❌ Error fetching customers:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// settings page

// Fetch center details
exports.getCenterDetails = async (req, res) => {
  try {
    const center = await Center.findById(req.params.id);
    if (!center) return res.status(404).json({ success: false, message: "Center not found" });
    res.json({ success: true, center });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update center details
exports.updateCenterDetails = async (req, res) => {
  try {
    const { name, email, phone, address, lat, lng } = req.body;
    const center = await Center.findByIdAndUpdate(
      req.params.id,
      { name, email, phone, address, lat, lng },
      { new: true }
    );
    res.json({ success: true, center });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Change password
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const center = await Center.findById(req.params.id);
    if (!center) return res.status(200).json({ success: false, message: "Center not found" });

    const isMatch = await bcrypt.compare(oldPassword, center.password);
    if (!isMatch) return res.status(200).json({ success: false, message: "Incorrect old password" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    center.password = hashedPassword;
    await center.save();
    res.json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Upload center image
exports.uploadImage = async (req, res) => {
  try {
      const centerId = req.params.id;

      // Check if file exists
      if (!req.file) {
          return res.status(200).json({ error: "Please upload an image file" });
      }

      // Get file path
      const imagePath = `${req.file.filename}`;

      // Find the center
      let center = await Center.findById(centerId);
      if (!center) {
          return res.status(200).json({ error: "Center not found" });
      }

      // Delete old image if it exists
      if (center.image) {
          const oldImagePath = path.join(__dirname, `../public${center.image}`);
          if (fs.existsSync(oldImagePath)) {
              fs.unlinkSync(oldImagePath); // Delete old image
          }
      }

      // Update center image field
      center.image = imagePath;
      await center.save();

      res.status(200).json({
          success: true,
          message: "Image uploaded successfully",
          image: imagePath
      });

  } catch (error) {
      console.error("Error uploading image:", error);
      res.status(500).json({ error: "Server error" });
  }
};


// products related

// @desc   Create a new product
// @route  POST /api/products/create
// @access Center Only
exports.createProduct = async (req, res) => {
  try {
      const { name, price, centerId } = req.body;

      if (!req.file) {
          return res.status(400).json({ message: 'Product image is required' });
      }

      const product = new Product({
          photo: req.file.path, // Store the image path from multer
          name,
          price,
          centerId
      });

      await product.save();
      res.status(201).json({ message: 'Product added successfully', product });
  } catch (error) {
      res.status(200).json({ message: 'Server error', error: error.message });
  }
};

// @desc   Get all products posted by a center
// @route  GET /api/products/center/:id
// @access Center Only
exports.getCenterProducts = async (req, res) => {
  try {
      const products = await Product.find({ centerId: req.params.id });
      res.status(200).json(products);
  } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
  }
};