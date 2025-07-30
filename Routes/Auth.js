const express = require('express');
const { register, login, getProfile, registerValidation, loginValidation } = require('../Controllers/authController');
const { authenticate } = require('../Middlewares/auth');

const router = express.Router();

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/profile', authenticate, getProfile);

module.exports = router;