const router = require("express").Router();
const uploadController = require("../controller/upload-controller");

router.route("/").post(uploadController.uploadFile);

module.exports = router;
