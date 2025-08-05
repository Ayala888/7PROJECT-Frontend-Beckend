const express = require('express');
const { register, login } = require('../controllers/AuthController');
const requestLimit = require('../middlewares/requestLimit')



const router = express.Router();

router.post('/register', register);
router.post('/login', requestLimit, login);


module.exports = router;

