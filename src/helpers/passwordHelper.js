const bcrypt = require('bcryptjs');
const { statusCode } = require('../config/default.json');

async function getPasswordHash(password, length) {
    return await bcrypt.hash(password, length);
}

async function verifyPassword(password, hash) {
    console.log('password----------->', password);
    const valid = await bcrypt.compare(password, hash);
    console.log('vaid--------->', valid);
    if (!valid) {
        return Promise.reject({
            status: statusCode.UNAUTHORIZED,
            message: 'Invalid password'
        });
    }
}

module.exports = { getPasswordHash, verifyPassword };