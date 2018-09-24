const mongoose = require('mongoose');

let StudentSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    hostel: {
        type: String
    },
    department: {
        type: String,
        required: true
    },
    regNo: {
        type: String,
        required: true
    },
    hostel: {
        type: String
    },
    amount: {
        type: Number
    },
    phone: {
        type: String
    }
});

let Student = module.exports = mongoose.model('Student', StudentSchema);
