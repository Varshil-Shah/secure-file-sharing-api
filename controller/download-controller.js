const File = require("../models/file-model");
const path = require("path");
const bcrypt = require("bcrypt");

exports.downloadFile = async (req, res) => {
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

  if (file.password) {
    if (!req.body.password) {
      return res.status(400).json({
        status: "fail",
        message: "Please enter password the file to download",
      });
    }

    const result = await bcrypt.compare(req.body.password, file.password);
    console.log(result);
    if (!result) {
      return res.status(400).json({
        status: "fail",
        message: "Please enter a valid password to download file",
      });
    }
  }

  const downloadPath = `${__dirname}/../${file.path}`;
  const filename = `${file.name.split("--")[0]}${path.extname(file.name)}`;
  res.download(downloadPath, filename, async () => {
    file.count++;
    await file.save();
  });
};
