const { Joi } = require('express-validation');

exports.login = Joi.object({
    userName: Joi.string().required(),
    password: Joi.string().required(),
    fcmToken: Joi.string().required()
});

exports.loginByUserId = Joi.object({
    deviceId: Joi.string().required(),
    userId: Joi.string().min(24).max(24).required()
});

exports.signup = Joi.object({
    countryId: Joi.string().min(24).max(24).required(),
    phone: Joi.string().min(6).max(16).required()
});

exports.verifyOtp = Joi.object({
    otp: Joi.string().min(6).required(),
    userId: Joi.string().required()
});
exports.resendOtp = Joi.object({
    userId: Joi.string().required()
});
exports.addCategory = Joi.object({
    userId: Joi.string().required(),
    categoryIds: Joi.array().items(Joi.string().required()).required()

});
exports.checkUserName = Joi.object({
    userName: Joi.string().required()
});
exports.addGames = Joi.object({
    userId: Joi.string().required(),
    gameIds: Joi.array().items(Joi.string().required()).required()
});
exports.profile = Joi.object({
    userId: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    // appKey: Joi.string().required(),
    userName: Joi.string().required(),
    DOB: Joi.string().required(),
    typeName: Joi.string().required().valid('profile_image'),
    locationType: Joi.string(),
    coordinates: Joi.array().items(Joi.number()).min(2),
    address: Joi.string(),

    // profile_image: Joi.string().required(),
    fcmToken: Joi.string().optional().allow(''),
    firstName: Joi.string().required(),
    lastName: Joi.string().required()
});

exports.addRemoveFollower = Joi.object({
    userId: Joi.string().min(24).max(24).required()
});

exports.followerFollowingListing = Joi.object({
    userId: Joi.string().min(24).max(24).optional(),
    skip: Joi.string().min(0).optional(),
    limit: Joi.string().min(0).optional(),
    type: Joi.string().valid('follower', 'following').required()
});


exports.editProfile = Joi.object({
    typeName: Joi.string().valid('profile_image', 'avatar'),
    avatarId: Joi.string().when('typeName', {
        is: 'avatar',
        then: Joi.string().min(24).max(24).required(),
        otherwise: Joi.forbidden()
    }),
    firstName: Joi.string().optional(),
    lastName: Joi.string().optional()
});

exports.addCommunity = Joi.object({
    userId: Joi.string().required(),
    communityId: Joi.string().min(24).max(24).required()
});

exports.totalPlayedTournament = Joi.object({
    userId: Joi.string().optional()
});

exports.userDetails = Joi.object({
    userId: Joi.string().min(24).max(24).optional()
});

exports.saveAccount = Joi.object({
    deviceId: Joi.string().required()
});
exports.changePassword = Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().required(),
    retypeNewPassword: Joi.string().required()

});

exports.createNewPassword = Joi.object({
    newPassword: Joi.string().required(),
    retypeNewPassword: Joi.string().required()
});

exports.sendOtp = Joi.object({
    phone: Joi.string().optional(),
    userId: Joi.string().optional()
});

exports.getWalletHistory = Joi.object({
    date: Joi.date().iso().optional(),
    id: Joi.string().min(24).max(24).optional(),
    skip: Joi.string().optional(),
    limit: Joi.string().optional()
});