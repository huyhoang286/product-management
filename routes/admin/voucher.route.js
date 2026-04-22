const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/voucher.controller");

router.get("/", controller.index);
router.get("/create", controller.create);
router.get("/edit/:id", controller.edit);

router.post("/create", controller.createPost);
router.patch("/edit/:id", controller.editPatch);
router.patch("/change-status/:status/:id", controller.changeStatus);
router.delete("/delete/:id", controller.deleteItem);

module.exports = router;