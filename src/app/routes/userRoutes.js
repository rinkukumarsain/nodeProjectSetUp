const express = require('express');
const router = express.Router();
const responseHandler = require('../../helpers/responseHandler');
const controllers = require('../controllers/userController');
const validate = require('../../helpers/validate');
const userVal = require('../../validators/app/userVal');
// const auth = require('../../middleware/auth');
// const { upload } = require('../../helpers/multer');


router.get('/index', async (req, res) => {
  res.send('api routes working properly ❤');
});

/* ___________________________ user sign up __________________________________ */
router.post('/login', validate(userVal.login), responseHandler(controllers.login));

module.exports = router;
