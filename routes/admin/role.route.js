const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/role.controller");
const authMiddleware = require("../../middlewares/admin/auth.middleware");

router.get(
  "/", 
  authMiddleware.requirePermission("roles_view"), 
  controller.index
);

router.get(
  "/create", 
  authMiddleware.requirePermission("roles_create"), 
  controller.create
);

router.post(
  "/create", 
  authMiddleware.requirePermission("roles_create"), 
  controller.createPost
);

router.get(
  "/edit/:id", 
  authMiddleware.requirePermission("roles_edit"), 
  controller.edit
);

router.patch(
  "/edit/:id", 
  authMiddleware.requirePermission("roles_edit"), 
  controller.editPatch
);

router.get(
  "/permissions", 
  authMiddleware.requirePermission("roles_permissions"), 
  controller.permissions
);

router.patch(
  "/permissions", 
  authMiddleware.requirePermission("roles_permissions"), 
  controller.permissionsPatch
);

module.exports = router;