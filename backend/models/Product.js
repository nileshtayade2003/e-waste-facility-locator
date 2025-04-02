const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    photo: {
        type: String, // Store image URL or file path
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: Number,
        enum: [0, 1], // 0: Not Sold, 1: Sold
        default: 0
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null // Null if not purchased yet
    },
    centerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Center',
        required: true
    },
    paymentMode: {
        type: Number,
        enum: [0, 1], // 0: Cash on Delivery, 1: Online
        default: null
    },
    orderStatus: {
        type: Number,
        enum: [1, 2], // 1: On Way, 2: Delivered
        default: null
    },
    paymentId: {
        type: String, // Stores Razorpay payment ID
        default: null
    },
    address: {
        type: String, // Stores the delivery address
        default: null,
        trim: true
    }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
