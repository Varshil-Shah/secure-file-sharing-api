const multer = require("multer");
const path = require("path");

const File = require("../models/file-model");

const storage = multer.diskStorage({
  destination: (_, __, callback) => callback(null, "uploads/"),
  filename: (_, file, callback) => {
    const [filename, extension] = file.originalname.split(".");
    const uniqueSuffix = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}.${extension}`;
    callback(null, filename + "--" + uniqueSuffix);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fieldSize: process.env.MAX_FILE_SIZE * 1024 * 1024,
  },
}).single("file");

exports.uploadFile = (req, res) => {
  upload(req, res, async (error) => {
    // if no file found in the request
    if (!req.file) {
      return res.status(404).json({
        error: "No file found!",
      });
    }

    // if some error occur while uploading
    if (error) {
      return res.status(500).json({
        error: `Something went wrong while uploading file...`,
        message: error.message,
      });
    }

    // store file to database
    const file = await File.create({
      name: req.file.filename,
      path: req.file.path,
      size: req.file.size,
    });

    console.log(file);

    res.status(201).json({
      status: "success",
      message: "File received to server!",
      file: `${process.env.APP_BASE_URL}/view/${file._id}`,
    });
  });
};
