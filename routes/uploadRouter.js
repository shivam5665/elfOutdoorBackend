const express = require('express');
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const router = express.Router();
const Upload = require('../models/slider');
const { authenticate, authorize} = require("../middleware/authMiddleware");

// Multer storage configuration
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/upload', authenticate,upload.single('file'), async (req, res) => {
  const file = req.file;
  const { title, desc } = req.body;

  if (!file) {
    return res.status(400).send('No file uploaded.');
  }

  if (!title || !desc) {
    return res.status(400).send('Title and description are required.');
  }

  try {
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: 'auto' },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

      uploadStream.end(file.buffer);
    });

    console.log('Upload Result:', uploadResult);

    // Optimize delivery by resizing and applying auto-format and auto-quality
    const optimizeUrl = cloudinary.url(uploadResult.public_id, {
      fetch_format: 'auto',
      quality: 'auto',
    });

    console.log('Optimize URL:', optimizeUrl);

    // Transform the image: auto-crop to square aspect ratio
    const autoCropUrl = cloudinary.url(uploadResult.public_id, {
      crop: 'auto',
      gravity: 'auto',
      width: 500,
      height: 500,
    });

    console.log('Auto Crop URL:', autoCropUrl);

    const newUpload = new Upload({
      title: title,
      desc: desc,
      public_id: uploadResult.public_id,
      optimizeUrl: optimizeUrl,
      autoCropUrl: autoCropUrl
    });

    const savedUpload = await newUpload.save();


    res.status(200).send({
      message: 'File uploaded successfully',
      data: savedUpload
    });

  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).send(error);
  }
});

module.exports = router;
