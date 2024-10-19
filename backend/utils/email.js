const nodemailer = require('nodemailer');
require('dotenv').config();

// Create a transporter object
const transporter = nodemailer.createTransport({
    service:"gmail",
    port: 465, // SSL port
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
});

// Utility function to send emails
exports.sendEmail = async (options) => {
    const mailOptions = {
        from: '"Nilesh Tayade" <nileshtayade2003@gmail.com>',
        to: options.to,
        subject: options.subject,
        html: options.html,
    };

    try {
        let info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully: ', info.response);
    } catch (error) {
        console.error('Error sending email:', error);
        if (error.response) {
            console.error('SMTP Response:', error.response);
        }
        throw error;
    }
};
