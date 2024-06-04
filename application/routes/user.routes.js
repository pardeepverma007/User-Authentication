const express = require('express');
const { userRegister, userLogin } = require('../controlers/user.controler')
const router = express.Router();
const upload = require('../middlewares/multer.middleware')

router.post('/register', upload.single("avatar"), userRegister);
router.post('/login', userLogin)

module.exports = router