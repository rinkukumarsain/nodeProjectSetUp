const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log('multer', req.body.typeName);
        console.log('multer', req.body);
        cb(null, `public/${req.body.typeName}`);
    },
    filename: function (req, file, cb) {
        let exe = file.originalname.split('.').pop();
        let filename = `${Date.now()}.${exe}`;
        cb(null, filename);
    }
});

exports.upload = multer({ storage: storage });

