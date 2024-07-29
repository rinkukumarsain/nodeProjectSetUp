const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const devConfig = require('../../config/dev.config');
const { statusCode, resMessage } = require('../../config/default.json');
const adminModel = require('../../models/adminModel');
/**
 * Handles the login process for admin users.
 *
 * @param {object} body - The request body containing user credentials.
 * @param {string} body.email - The email of the user.
 * @param {string} body.password - The password of the user.
 *
 * @returns {object} - An object containing the status code, success flag, message, and data.
 * @returns {number} statusCode - The HTTP status code.
 * @returns {boolean} success - Whether the operation was successful or not.
 * @returns {string} message - A message describing the result.
 * @returns {object} data - The user object with updated token and login date.
 */
exports.login = async (body) => {
  try {
    // Find the user by email
    const chkUser = await adminModel.findOne({ email: body.email });

    // If user not found, return error
    if (!chkUser) {
      return {
        statusCode: statusCode.OK,
        success: false,
        message: resMessage.Data_Not_Found
      };
    }

    // If user is blocked, return error
    if (chkUser.isBlocked) {
      return {
        statusCode: statusCode.OK,
        success: false,
        message: resMessage.Your_Account_is_Blocked
      };
    }

    // If user found and password matches, generate token and update user data
    if (bcrypt.compareSync(body.password, chkUser.password)) {
      let obj = {
        token: jwt.sign(
          { _id: chkUser._id, email: chkUser.email },
          devConfig.JWT_KEY
        ),
        appKey: body?.appKey,
        loginDate: new Date(),
        loginStatus: true
      };
      const data = await adminModel.findByIdAndUpdate(chkUser._id, obj, {
        new: true
      });

      return {
        statusCode: statusCode.OK,
        success: true,
        message: resMessage.Admin_Login_Success,
        data: {
          userId: data._id,
          token: data.token
        }
      };
    } else {
      // If password does not match, return error
      return {
        statusCode: statusCode.OK,
        success: false,
        message: resMessage.Incorrect_Email_Password
      };
    }
  } catch (error) {
    // If any error occurs, return error
    return {
      statusCode: statusCode.BAD_REQUEST,
      success: false,
      message: error.message
    };
  }
};
