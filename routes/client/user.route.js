const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/user.controller");

router.get("/register", controller.register);
router.post("/register", controller.registerPost);

router.get("/otp", controller.otp);
router.post("/otp", controller.otpPost);
router.get("/login", controller.login);
router.post("/login", controller.loginPost);
router.get("/logout", controller.logout);
router.get("/info", controller.info);
router.patch("/update", controller.updatePatch);

module.exports = router;