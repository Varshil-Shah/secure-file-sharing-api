const File = require("../models/file-model");

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

    res.status(200).json({
      status: "success",
      data: {
        data: file,
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
