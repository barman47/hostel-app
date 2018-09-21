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

let MaleStudentSchema = mongoose.Schema({
    blockA: [blockASchema],
    blockB: [blockBSchema],
    blockC: [blockCSchema],
    blockD: [blockDSchema]
    // firstname: {
    //     type: String,
    //     required: true
    // },
    // lastname: {
    //     type: String,
    //     required: true
    // },
    // email: {
    //     type: String,
    //     required: true
    // },
    // password: {
    //     type: String,
    //     required: true
    // },
    // gender: {
    //     type: String,
    //     required: true
    // },
    // level: {
    //     type: String
    // },
    // college: {
    //     type: String
    // },
    // roomNumber: {
    //     type: Number
    // },
});

let MaleStudent = module.exports = mongoose.model('MaleStudent', MaleStudentSchema);
