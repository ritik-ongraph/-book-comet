const express = require('express');
const router = express.Router();
const userLoginController = require('../controllers/users')
router.post('/user/login',userLoginController.userLogin)


module.exports = router;