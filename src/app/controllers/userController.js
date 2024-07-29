const services = require('../services/userService');
const { statusCode } = require('../../config/default.json');


/**
 * Function to handle user login.
 *
 * @param {Object} param - The function parameter object.
 * @param {Object} param.body - The request body containing user credentials.
 * @returns {Object} - The response object containing status code, success flag, and message.
 * @throws Will throw an error if login fails.
 */
exports.login = async ({ body }) => {
    try {
        // Call the login service with the provided user credentials
        return await services.login(body);
    } catch (error) {
        // If an error occurs during login, return a 400 status code, success flag as false, and the error message
        return {
            statusCode: statusCode.BAD_REQUEST,
            success: false,
            message: error.message
        };
    }
};
