const express = require('express');
const router = express.Router();
const multer  = require('multer')
const storageMulter = require("../../helpers/storageMulter")
const upload = multer({ storage: storageMulter() })
const controller = require("../../controllers/admin/product.controller")
const validate = require("../../validates/admin/product.validate")
const authMiddleware = require("../../middlewares/admin/auth.middleware")

router.get("/", authMiddleware.requirePermission("products_view"), controller.index)

router.get("/create", authMiddleware.requirePermission("products_create"), controller.create)
router.post(
    "/create",
    upload.single("thumbnail"),
    validate.createPost,
    authMiddleware.requirePermission("products_create"),
    controller.createPost)

router.get("/edit/:id", authMiddleware.requirePermission("products_edit"), controller.edit)
router.patch(
    "/edit/:id",
    upload.single("thumbnail"),
    validate.createPost,
    authMiddleware.requirePermission("products_edit"),
    controller.editPatch)
    
router.patch("/change-status/:status/:id", authMiddleware.requirePermission("products_edit"), controller.changeStatus)
router.patch("/change-multi", authMiddleware.requirePermission("products_edit"), controller.changeMulti)
router.patch("/change-multi-trash", controller.changeMultiTrash)

router.delete("/delete/:id", authMiddleware.requirePermission("products_delete"), controller.deleteItem)

router.patch("/restore/:id", controller.restoreItem)

module.exports = router;