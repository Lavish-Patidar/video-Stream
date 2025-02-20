const express = require('express');
const router = express.Router();
const multer = require('multer');
const videoController = require('../controllers/videoController');

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Video Routes
router.post('/upload', upload.single('video'), videoController.uploadVideo);
router.get('/stream/:filename', videoController.streamVideo);
router.get('/list', videoController.listVideos);
router.put('/:id', videoController.updateVideo);
router.delete('/:id', videoController.deleteVideo);

module.exports = router;
