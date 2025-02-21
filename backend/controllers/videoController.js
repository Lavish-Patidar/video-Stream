const Video = require('../models/Video');
const mongoose = require('mongoose');
const { GridFSBucket } = require('mongodb');

const uploadVideo = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Check file size (10MB limit)
        const maxSize = 10 * 1024 * 1024; // 10MB in bytes
        if (req.file.size > maxSize) {
            return res.status(400).json({
                message: 'File size exceeds 10MB limit'
            });
        }


        const conn = mongoose.connection;
        const gfs = new GridFSBucket(conn.db, {
            bucketName: 'videos',
        });

        const filename = req.file.originalname;
        const uploadStream = gfs.openUploadStream(filename, {
            contentType: req.file.mimetype,
        });

        uploadStream.end(req.file.buffer);

        // Save video metadata
        const video = new Video({
            filename: filename,
            contentType: req.file.mimetype,
            title: req.body.title || filename,
        });

        await video.save();

        uploadStream.on('finish', () => {
            res.status(201).json({ message: 'Video uploaded successfully' });
        });

        uploadStream.on('error', (err) => {
            res.status(500).json({ error: err.message });
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const streamVideo = async (req, res) => {
    try {
        const conn = mongoose.connection;
        const gfs = new GridFSBucket(conn.db, {
            bucketName: 'videos',
        });

        const file = await gfs.find({ filename: req.params.filename }).toArray();
        if (!file || file.length === 0) {
            return res.status(404).json({ message: 'Video not found' });
        }

        const readStream = gfs.openDownloadStreamByName(req.params.filename);
        res.set('Content-Type', file[0].contentType);
        readStream.pipe(res);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const updateVideo = async (req, res) => {
    try {
        const { id } = req.params;
        const { title } = req.body;

        const updatedVideo = await Video.findByIdAndUpdate(
            id,
            { title },
            { new: true }
        );

        if (!updatedVideo) {
            return res.status(404).json({ message: 'Video not found' });
        }

        res.status(200).json(updatedVideo);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const deleteVideo = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedVideo = await Video.findByIdAndDelete(id);

        if (!deletedVideo) {
            return res.status(404).json({ message: 'Video not found' });
        }

        const conn = mongoose.connection;
        const gfs = new GridFSBucket(conn.db, {
            bucketName: 'videos',
        });

        // Find and delete the video file from GridFS using filename
        const file = await conn.db.collection('videos.files').findOne({ filename: deletedVideo.filename });
        if (file) {
            await gfs.delete(file._id);
            // Delete all chunks associated with the video using files_id
            const chunksCollection = conn.db.collection('videos.chunks');
            await chunksCollection.deleteMany({ files_id: file._id });
        }

        res.status(200).json({ message: 'Video and all associated chunks deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const listVideos = async (req, res) => {
    try {
        const videos = await Video.find({}, 'filename title uploadDate');

        res.status(200).json(videos);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    uploadVideo,
    streamVideo,
    listVideos,
    updateVideo,
    deleteVideo,
};
