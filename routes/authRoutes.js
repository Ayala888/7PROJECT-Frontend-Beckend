const express = require('express');

const requestLimit = require('../middlewares/requestLimit');
const { register, login } = require('../controllers/authController')




const router = express.Router();

router.post('/register', register);
router.post('/login', requestLimit, login);


module.exports = router;

