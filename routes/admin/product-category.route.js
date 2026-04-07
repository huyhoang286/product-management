const express = require("express");
const router = express.Router();
const multer = require("multer");
const controller = require("../../controllers/admin/product-category.controller");
const storageMulter = require("../../helpers/storageMulter");
const upload = multer({ storage: storageMulter() });
const authMiddleware = require("../../middlewares/admin/auth.middleware");

router.get(
  "/", 
  authMiddleware.requirePermission("products-category_view"), 
  controller.index
);

router.get(
  "/create", 
  authMiddleware.requirePermission("products-category_create"), 
  controller.create
);

router.post(
  "/create", 
  upload.single("thumbnail"), 
  authMiddleware.requirePermission("products-category_create"), 
  controller.createPost
);

router.get(
  "/edit/:id", 
  authMiddleware.requirePermission("products-category_edit"), 
  controller.edit
);

router.patch(
  "/edit/:id", 
  upload.single("thumbnail"), 
  authMiddleware.requirePermission("products-category_edit"), 
  controller.editPatch
);

module.exports = router;