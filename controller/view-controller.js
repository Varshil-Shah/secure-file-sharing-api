const File = require("../models/file-model");
const path = require("path");

exports.viewFile = async (req, res) => {
  try {
    const { id } = req.params;
    const file = await File.findOne({
      _id: id,
    });

    // if file not found, means user has provide some invalid id
    if (!file) {
      return res.status(404).json({
        status: "fail",
        message: "Invalid url or file not found!",
      });
    }

    console.log(file);
    const [filename] = file.name.split("--");

    res.status(200).json({
      status: "success",
      data: {
        filename: `${filename}${path.extname(file.name)}`,
        size: `${Math.round(file.size / 1024)} KB`,
        createdAt: new Date(file.createdAt).toLocaleString(),
        downloadCounts: file.count,
        download: `${process.env.APP_BASE_URL}/api/v1/download/${file._id}`,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong at server!",
      error,
    });
  }
};
