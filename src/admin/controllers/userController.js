const services = require('../services/userService');
const { statusCode } = require('../../config/default.json');
/** ========================= Helllooooo ===============================/**
 * Function to handle user login.
 *
 * @param {Object} req - The function parameter object.
 * @param {Object} req.body - The request body containing user credentials.
 * @returns {Object} - An object containing the status code, success flag, and message or the user data.
 * @throws Will throw an error if there is a problem with the database or input validation.
 */
exports.login = async ({ body }) => {
    try {
        return await services.login(body);
    } catch (error) {
        return {
            statusCode: statusCode.BAD_REQUEST,
            success: false,
            message: error.message
        };
    }
};