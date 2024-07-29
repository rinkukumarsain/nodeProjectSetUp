const { deleteFile } = require('../utils/fileSystem');
const path = require('path');

module.exports = (schema) => (req, res, next) => {
    const ragVal = schema.validate(Object.keys(req.body).length !== 0 ? req.body : req.query);
    if (ragVal.error) {
        if (req.file?.filename) {
            deleteFile(path.join(__dirname, '../../public/' + req.body.typeName + '/' + req.file.filename));
        }
        const message = ragVal.error.message;
        return res.status(200).json({ success: false, message });
    } else {
        next();
    }
};