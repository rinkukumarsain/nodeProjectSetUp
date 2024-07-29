const randomstring = require('randomstring');
const { APP_SHORT_NAME } = require('../config/dev.config');

exports.generateOtp = () => {
    try {
        Math.floor(1000 + Math.random() * 9000);
        return 123456;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

exports.generateTransactionId = async (Number) => {
    try {
        const randomStr = randomstring.generate({
            length: Number ? Number : 4,
            charset: 'alphabetic',
            capitalization: 'uppercase'
        });
        return `${APP_SHORT_NAME}-${Date.now()}-${randomStr}`;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

