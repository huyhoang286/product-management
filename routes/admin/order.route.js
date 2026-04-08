const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/order.controller");

router.get("/", controller.index);
router.patch("/change-status/:id", controller.changeStatusPatch);
router.get("/detail/:id", controller.detail);

module.exports = router;