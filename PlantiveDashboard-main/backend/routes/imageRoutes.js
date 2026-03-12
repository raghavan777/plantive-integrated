const express = require('express');
const router = express.Router();
const { uploadImage, getImages, getImage, compareImages, deleteImage } = require('../controllers/imageController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
        const unique = crypto.randomBytes(8).toString('hex');
        cb(null, `img-${unique}${path.extname(file.originalname)}`);
    },
});

const fileFilter = (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    if (ext && mime) return cb(null, true);
    cb(new Error('Only image files are allowed (jpeg, jpg, png, webp)'));
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 15 * 1024 * 1024 } });

router.use(protect);

router.post('/upload', upload.array('images', 20), uploadImage);
router.get('/compare', compareImages);

router.route('/')
    .get(getImages);

router.route('/:id')
    .get(getImage)
    .delete(authorizeRoles('admin'), deleteImage);

module.exports = router;