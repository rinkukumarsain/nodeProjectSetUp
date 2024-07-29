const mongoose = require('mongoose');

const userModel = new mongoose.Schema({
    countryId: {
        type: mongoose.Types.ObjectId,
        default: 'email',
        ref: 'countrie'
    },
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        default: ''
    },
    phone: {
        type: Number,
        trim: true,
        default: ''
    },
    profile_image: {
        type: String,
        default: '',
        trim: true
    },
    password: {
        type: String,
        default: ''
    },
    token: {
        type: String,
        default: '',
        trim: true
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    appKey: {
        type: String,
        default: ''
    },
    DOB: {
        type: Date,
        default: null
    },
    loginDate: {
        type: Date,
        default: null
    },
    loginStatus: {
        type: Boolean,
        default: false
    }
}, { timestamps: true, versionKey: false });

const user = mongoose.model('admin', userModel);

module.exports = user;