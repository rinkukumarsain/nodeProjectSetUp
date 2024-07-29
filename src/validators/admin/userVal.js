const { Joi } = require('express-validation');

exports.signUp = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    DOB: Joi.string().isoDate().required(),
    email: Joi.string().required().email(),
    countryId: Joi.string().min(24).max(24).required(),
    password: Joi.string().required(),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required()
});


exports.login = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    appKey: Joi.string().optional()
});

exports.userList = Joi.object({
    skip: Joi.number().optional(),
    limit: Joi.number().optional(),
    sort: Joi.object().optional(),
    search: Joi.string().optional().allow('')

});
exports.countriesList = Joi.object({
    name: Joi.string().optional(),
    code: Joi.string().optional()
});
exports.userDownloads = Joi.object({
    type: Joi.string().valid('week', 'year', 'month').required()
});

exports.updateUserProfile = Joi.object({
    typeName: Joi.string().valid('profile').required(),
    countryId: Joi.string().min(24).max(24).required(),
    phone: Joi.string().min(5).max(20).optional(),
    name: Joi.string().optional()
});

exports.updateProfile = Joi.object({
    typeName: Joi.string().optional().valid('adminProfile'),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().required().email()
});

exports.addAvatar = Joi.object({
    typeName: Joi.string().required().valid('avatar')
});

exports.editAvatar = Joi.object({
    _id: Joi.string().max(24).min(24).required(),
    typeName: Joi.string().required().valid('avatar')
});


exports.deleteAvatar = Joi.object({
    _id: Joi.string().max(24).min(24).required()
});