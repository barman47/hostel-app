const mongoose = require('mongoose');

let blockASchema = mongoose.Schema({
    name: String,
    regNo: String,
    college: String,
    Level: String,
    roomNumber: Number
});

let blockBSchema = mongoose.Schema({
    name: String,
    regNo: String,
    college: String,
    Level: String,
    roomNumber: Number
});

let blockCSchema = mongoose.Schema({
    name: String,
    regNo: String,
    college: String,
    Level: String,
    roomNumber: Number
});

let blockDSchema = mongoose.Schema({
    name: String,
    regNo: String,
    college: String,
    Level: String,
    roomNumber: Number
});

let FemaleStudentSchema = mongoose.Schema({
    blockA: [blockASchema],
    blockB: [blockBSchema],
    blockC: [blockCSchema],
    blockD: [blockDSchema]
});

let FemaleStudent = module.exports = mongoose.model('FemaleStudent', FemaleStudentSchema);
