const router = require("express").Router();
const downloadController = require("../controller/download-controller");

router.route("/:id").get(downloadController.downloadFile);

module.exports = router;
