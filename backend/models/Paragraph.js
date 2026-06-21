const mongoose = require('mongoose');

const paragraphSchema = new mongoose.Schema({

    text: {
        type: String,
        required: true
    },
    difficulty:{
        type: String,
        enum: ['easy', 'medium', 'hard'],
        required: true
    },
    duration:{
        type: Number,
        required: true
    }

});

module.exports = mongoose.model('paragraph', paragraphSchema);