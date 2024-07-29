const mongoose = require('mongoose');

const userModel = new mongoose.Schema({
    countryId: {
        type: mongoose.Types.ObjectId,
        default: null,
        ref: 'countrie'
    },
    userName: {
        type: String,
        // required: true,
        trim: true,
        default: ''
    },
    firstName: {
        type: String,
        // required: true,
        trim: true,
        default: ''
    },
    lastName: {
        type: String,
        // required: true,
        trim: true,
        default: ''
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
    isPhoneVerify: {
        type: Boolean,
        default: false
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
    fcmToken: {
        type: String,
        default: '',
        trim: true
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: false
    },
    isStatus: {
        type: Boolean,
        default: false
    },
    otp: {
        type: String,
        default: ''
    },
    // appKey: {
    //     type: String,
    //     default: ''
    // },
    DOB: {
        type: Date,
        default: null
    },
    bio: {
        type: String,
        // required: true,
        default: ''
    },
    location: {
        type: {
            locationType: {
                type: String,
                enum: ['Point'],
                default: 'Point'
            },
            address: {
                type: String,
                default: ''
            },
            coordinates: {
                type: [Number],
                default: []
                // validate: {
                //     validator: function (value) {
                //         return value.length === 2;
                //     },
                //     message: 'Coordinates must be an array of two numbers [longitude, latitude].'
                // }
            }
        },
        default: {}
    },
    loginStatus: {
        type: Boolean,
        default: false
    },
    loginDate: {
        type: Date,
        default: null
    },
    wallet: {
        type: {
            'balance': Number,
            'bonus': Number,
            'winning': Number,
            'lockedBalance': Number
        },
        default: {
            'balance': 0,
            'bonus': 0,
            'winning': 0,
            'lockedBalance': 0
        }
    },
    category: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'categories'
    }],
    games: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'games'
    }],
    communityId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Community'
    }],
    isGamer: {
        type: Boolean,
        default: false
    },
    followers: {
        type: [mongoose.Types.ObjectId],
        default: [],
        ref: 'user'
    },
    archived: {
        type: {
            tournamentId: [mongoose.Types.ObjectId],
            default: []
        }
    }
}, { timestamps: true, versionKey: false });

const user = mongoose.model('user', userModel);

module.exports = user;