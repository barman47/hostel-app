const mongoose = require('mongoose');

let blockSchema = mongoose.Schema({
    studentName: {
        type: String,
        required: true
    },

    blockName: {
        type: String,
        required: true
    },
    roomNumber: {
        type: Number
    },
    availableRooms: {
        type: Number,
        Default: 10
    },
    regNo: {
        type: String
    }
});

let MaleHostelSchema = mongoose.Schema({
    hostel: [blockSchema]
});

let MaleHostel = module.exports = mongoose.model('MaleHostel', MaleHostelSchema);
