const express = require("express");
const router = express.Router();
const multer = require("multer");
const controller = require("../../controllers/admin/account.controller");
const storageMulter = require("../../helpers/storageMulter");
const upload = multer({ storage: storageMulter() });
const authMiddleware = require("../../middlewares/admin/auth.middleware");

router.get(
  "/", 
  authMiddleware.requirePermission("accounts_view"), 
  controller.index
);

router.get(
  "/create", 
  authMiddleware.requirePermission("accounts_create"), 
  controller.create
);

router.post(
  "/create", 
  upload.single("avatar"), 
  authMiddleware.requirePermission("accounts_create"), 
  controller.createPost
);

router.get(
  "/edit/:id", 
  authMiddleware.requirePermission("accounts_edit"), 
  controller.edit
);

router.patch(
  "/edit/:id", 
  upload.single("avatar"), 
  authMiddleware.requirePermission("accounts_edit"), 
  controller.editPatch
);

module.exports = router;