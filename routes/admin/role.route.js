const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/role.controller");

const multer = require("multer");
const upload = multer();

router.get("/", controller.index);
router.get("/create", controller.create);
router.post("/create", upload.none(), controller.createPost);

//Phân quyền
router.get("/permissions", controller.permissions);
router.patch("/permissions", upload.none(), controller.permissionsPatch);
//End phân quyền

router.get("/edit/:id", controller.edit);
router.patch("/edit/:id", upload.none(), controller.editPatch);

router.delete("/delete/:id", controller.deleteItem);

module.exports = router;