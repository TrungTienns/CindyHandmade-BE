// src/config/cloudinary.config.js
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config();

// Cấu hình Cloudinary với các key trong .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Cấu hình storage cho multer
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'KnitWorkshop', // Tên thư mục trên Cloudinary để chứa ảnh
    allowedFormats: ['jpeg', 'png', 'jpg'], // Chỉ cho phép định dạng này
  }
});

const uploadCloud = multer({ storage });

module.exports = uploadCloud;
