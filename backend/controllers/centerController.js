// controllers/centerController.js
const Appointment = require("../models/Appointment");
const Center = require("../models/Center");
const { sendEmail } = require("../utils/email"); // Import email utility
const { generateToken } = require("../utils/genrateToken");
const bcrypt = require("bcryptjs");

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
    const appointments = await Appointment.find({ center: centerId });

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
  const { appointmentId } = req.params;

  try {
    // Find the appointment by its ID
    const appointment = await Appointment.findById(appointmentId);
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
      to: appointment.customerEmail, // assuming you store the user's email in appointment.userEmail
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
                        <p>Hello <strong>${appointment.customerName}</strong>,</p>
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

    res.status(200).json({ message: "Appointment approved and email sent" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
