const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const {
  createPost,
  getPost,
  getPostById,
  updatePost,
  deletePost,
  searchPosts
} = require('../controllers/postController');

const authMiddleware = require('../middlewares/authMiddleware');


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './uploads';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueName + ext);
  },
});

const upload = multer({ storage });



router.get('/', getPost);


router.get('/search', searchPosts);



router.get('/:id', getPostById);


router.post('/', authMiddleware, upload.array('images'), createPost);


router.put('/:id', authMiddleware, updatePost);


router.delete('/:id', authMiddleware, deletePost);





module.exports = router;




