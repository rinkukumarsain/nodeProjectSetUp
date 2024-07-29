const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const devConfig = require('../../config/dev.config');
const userModel = require('../../models/userModel');
const { statusCode, resMessage } = require('../../config/default.json');
const { dbQuery } = require('../../utils/mongodbQuery');
/**
 * Handles user login.
 *
 * @param {object} body - The user's login credentials.
 * @param {string} body.userName - The user's username.
 * @param {string} body.password - The user's password.
 * @param {string} body.fcmToken - The user's fcmToken.
 * @returns {object} - An object containing the status code, success flag, message, and user data.
 * @throws Will throw an error if there is a database error.
 */
exports.login = async (body) => {
    try {
        // Find the user in the database by userName
        const findData = await dbQuery.findOne(userModel, { 'userName': { '$regex': body.userName, '$options': 'i' } });

        // If user not found, return an error message
        if (!findData) {
            return {
                statusCode: statusCode.OK,
                success: false,
                message: resMessage.Data_Not_Found
            };
        }

        // If user account is blocked, return an error message
        if (findData.isBlocked) {
            return {
                statusCode: statusCode.OK,
                success: false,
                message: resMessage.Your_Account_is_Blocked
            };
        }

        // If user found and password is correct, generate JWT token and update user's login date
        if (bcrypt.compareSync(body.password, findData.password)) {
            let obj = {
                token: jwt.sign({ _id: findData._id, username: findData.username }, devConfig.JWT_KEY),
                fcmToken: body.fcmToken,
                loginDate: new Date(),
                loginStatus: true,
                isActive: true
            };

            // Update the user with the new token and other details
            const data = await userModel.findByIdAndUpdate(findData._id, obj, { new: true });

            // Return success message with userId and token
            return {
                statusCode: statusCode.OK,
                success: true,
                message: resMessage.User_login_Successfully,
                data: {
                    userId: data._id,
                    token: data.token
                }
            };
        } else {
            // If password is incorrect, return an error message
            return {
                statusCode: statusCode.OK,
                success: false,
                message: resMessage.Incorrect_Username_Password
            };
        }
    } catch (error) {
        // If there is any error, return an error message
        return {
            statusCode: statusCode.BAD_REQUEST,
            success: false,
            message: error.message
        };
    }
};
