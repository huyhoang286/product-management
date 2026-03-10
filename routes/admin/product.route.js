const express = require('express');
const router = express.Router();
const controller = require("../../controllers/admin/product.controller")

router.get("/", controller.index)
router.get("/trash", controller.trash)
router.patch("/change-status/:status/:id", controller.changeStatus)
router.patch("/change-multi", controller.changeMulti)
router.delete("/delete/:id", controller.deleteItem)
router.delete("/delete-permanent/:id", controller.deletePermanent)
router.patch("/restore/:id", controller.restoreItem)

module.exports = router;