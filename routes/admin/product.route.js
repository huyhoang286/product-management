const express = require('express');
const router = express.Router();
const multer  = require('multer')
const storageMulter = require("../../helpers/storageMulter")
const upload = multer({ storage: storageMulter() })
const controller = require("../../controllers/admin/product.controller")

router.get("/", controller.index)
router.get("/trash", controller.trash)
router.get("/create", controller.create)
router.post(
    "/create",
    upload.single("thumbnail"),
    controller.createPost)
router.patch("/change-status/:status/:id", controller.changeStatus)
router.patch("/change-multi", controller.changeMulti)
router.patch("/change-multi-trash", controller.changeMultiTrash)
router.delete("/delete/:id", controller.deleteItem)
router.delete("/delete-permanent/:id", controller.deletePermanent)
router.patch("/restore/:id", controller.restoreItem)

module.exports = router;