const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/user.controller");
const passport = require('passport');
const authMiddleware = require("../../middlewares/client/user.middleware");

router.get("/register", controller.register);
router.post("/register", controller.registerPost);

router.get("/otp", controller.otp);
router.post("/otp", controller.otpPost);
router.get("/login", controller.login);
router.post("/login", controller.loginPost);
router.get("/logout", controller.logout);
router.get("/info", controller.info);
router.patch("/update", controller.updatePatch);
router.patch("/password/change", controller.changePasswordPatch);

router.get("/password/forgot", controller.forgotPassword);
router.post("/password/forgot", controller.forgotPasswordPost);
router.get("/password/otp", controller.otpPassword);
router.post("/password/otp", controller.otpPasswordPost);
router.get("/password/reset", controller.resetPassword);
router.post("/password/reset", controller.resetPasswordPost);

router.get("/orders", controller.orders);
router.get("/orders/detail/:id", controller.detail);

router.post("/vouchers/save/:id", controller.saveVoucher);
router.get("/vouchers", authMiddleware.requireAuth, controller.vouchers);

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/user/login', session: false }),
  controller.googleLoginCallback
);

module.exports = router;