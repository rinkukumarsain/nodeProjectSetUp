const jwt = require('jsonwebtoken');
const adminModel = require('../models/adminModel');
const config = require('../config/dev.config');

module.exports = async (req, res, next) => {
    try {
        if (req.headers.authorization) {
            const token = req.headers.authorization.split(' ').pop();
            const { _id } = jwt.verify(token, config.JWT_KEY);
            req.user = await adminModel.findOne({ _id });
            if (req.user?.isBlocked) {
                return res.status(401).json({
                    status: 400,
                    message: 'Your Account is Blocked...!'
                });
            }
            // if (req.user && req.user.token === token) {
            if (req.user) {
                next();
            } else {
                return res.status(401).json({
                    success: 400,
                    message: 'Unauthorized',
                    data: []
                });
            }
        } else {
            return res.status(401).json({
                success: 400,
                message: 'Token Not Found',
                data: []
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            success: 400,
            message: 'Invalid Token',
            data: []
        });
    }
};