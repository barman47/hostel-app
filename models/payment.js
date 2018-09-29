const mongoose = require('mongoose');

let PaymentSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    regNo: {
        type: String,
        required: true
    },
    room: {
        type: String,
        required: true
    },
    amount: {
        type: String,
        required: true
    }
});

let Payment = module.exports = mongoose.model('Payment', PaymentSchema);