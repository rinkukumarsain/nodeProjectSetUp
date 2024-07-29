const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const config = require('../config/dev.config');

module.exports = async (req, res, next) => {
    try {
        if (req.headers.authorization) {
            const token = req.headers.authorization.split(' ').pop();
            const { _id } = jwt.verify(token, config.JWT_KEY);
            req.user = await userModel.findOne({ _id }).populate({ path: 'countryId' });
            if (req.user?.isBlocked) {
                return res.status(401).json({
                    success: false,
                    message: 'Your Account is Blocked...!'
                });
            }
            // if (req.user && req.user.token === token) {
            if (req.user) {
                console.log('userId:', req.user._id.toString());
                next();
            } else {
                return res.status(401).json({
                    success: false,
                    message: 'Unauthorized',
                    data: []
                });
            }
        } else {
            return res.status(401).json({
                success: false,
                message: 'Token Not Found',
                data: []
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            success: false,
            message: 'Invalid Token',
            data: []
        });
    }
};