const express = require('express');
const router = express.Router();
const ProfileController = require('../controllers/profileController');
const authMiddleware = require('../middlewares/authMiddleware');


router.get('/profile/homes', authMiddleware, ProfileController.getUserHomes);
router.get('/profile', authMiddleware, ProfileController.getProfile)
router.put('/update', authMiddleware, ProfileController.updateProfile)






module.exports = router;
