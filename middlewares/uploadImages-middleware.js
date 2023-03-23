/* eslint-disable linebreak-style */
const multer = require('multer');
const path = require('path');
const sharp = require('sharp');

const multerStorage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, path.join(__dirname, '../public/uploads/products'));
  },
  filename(req, file, cb) {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}.jpeg`);
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(
      {
        message: 'Unsupported file format',
      },
      false
    );
  }
};

const uploadPhoto = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: { fieldSize: 2000000 },
});

const uploadMultiplePhoto = uploadPhoto.fields([
  { name: 'images', maxCount: 10 },
]);

// const productImgResize = async(req, res, next) => {
//     if(!req.files) return next();
//     await Promise.all(req.files.map(async(file) => {
//         await sharp(file.path)
//             .resize(300,300)
//             .toFormat("jpeg")
//             .jpeg({quality: 90})
//             .toFile(`public/uploads/products/${file.filename}`)
//         })
//     );
//     next();
// };

module.exports = { uploadMultiplePhoto };

// ss103 multer code
// const multer = require("multer");

// const Storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "public/uploads");
//   },
//   filename: (req, file, cb) => {
//     cb(null, file.originalname);
//   },
// });

// const editedStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "public/uploads");
//   },
//   filename: (req, file, cb) => {
//     cb(null, file.originalname);
//   },
// });

// module.exports = {
//   uploads: multer({ storage: Storage }).single("Image"),
//   editeduploads: multer({ storage: editedStorage }).single("file2"),
// };
