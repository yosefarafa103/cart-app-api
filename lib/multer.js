const cloudinary = require("../lib/cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: () => ({
    // folder: "productImages",
    allowed_formats: ["jpeg", "png", "jpg"],
  }),
});
const upload = multer({
  storage,
});

module.exports = upload;
