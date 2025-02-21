const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  filename: { type: String, required: true, unique: true },
  contentType: { type: String, required: true },
  title: { type: String, required: true },
  uploadDate: { type: Date, default: Date.now },
});


module.exports = mongoose.model('Video', videoSchema);
