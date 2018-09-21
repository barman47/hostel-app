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
    level: {
        type: String
    },
    college: {
        type: String
    },
    roomNumber: {
        type: Number
    },
});

let Student = module.exports = mongoose.model('Student', StudentSchema);