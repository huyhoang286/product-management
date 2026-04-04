const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();

const controller = require("../../controllers/admin/auth.controller");

router.get("/login", controller.login);
router.post("/login", upload.none(), controller.loginPost);

router.get("/logout", controller.logout);

module.exports = router;