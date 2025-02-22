const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000; // Default port for local development


// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const connectDB = require('./config/db');

const startServer = async () => {
    try {
        connectDB();

        const conn = mongoose.connection;
        let gfs;

        conn.once('open', () => {
            gfs = new mongoose.mongo.GridFSBucket(conn.db, {
                bucketName: 'videos',
            });

            // Start server only after DB connection is established
            app.listen(PORT, () => { // Start server on the assigned port

                console.log(`Server running on port ${PORT}`);
            });
        });
    } catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
};

startServer();


// Import Video Routes
const videoRoutes = require('./routes/videoRoutes');


// Routes
app.use('/api/videos', videoRoutes);
app.get('/', (req, res) => {
    res.send('Video Streaming API');
});
