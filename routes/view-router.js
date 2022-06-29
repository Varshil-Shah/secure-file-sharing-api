const router = require("express").Router();
const viewController = require("../controller/view-controller.js");

router.route("/:id").get(viewController.viewFile);

module.exports = router;
