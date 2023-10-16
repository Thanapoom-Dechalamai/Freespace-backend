const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
        unique: true
    },
    caption: {
        type: String,
        max: 300,
        default: ""
    },
    picture: {
        type: String,
        trim: true,
        default: "http://localhost:8000/images/1.jpg"
    },
    following: {
        type: Array,
        default: [],
    },
    followers: {
        type: Array,
        default: [],
    }
}, { timestamps: true });

module.exports = mongoose.model('profiles', schema);