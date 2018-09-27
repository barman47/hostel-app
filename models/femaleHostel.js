const mongoose = require('mongoose');

let blockASchema = mongoose.Schema({
    room: {
        type: Number,
        required: true
    }
});

let blockBSchema = mongoose.Schema({
    room: {
        type: Number,
        required: true
    }
});

let blockCSchema = mongoose.Schema({
    room: {
        type: Number,
        required: true
    }
});

let blockDSchema = mongoose.Schema({
    room: {
        type: Number,
        required: true
    }
});

let FemaleHostelSchema = mongoose.Schema({
    blockA: blockASchema,
    blockB: blockBSchema,
    blockC: blockCSchema,
    blockD: blockDSchema
});

let FemaleHostel = module.exports = mongoose.model('FemaleHostel', FemaleHostelSchema);
