const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/checkout.controller");
const userMiddleware = require("../../middlewares/client/user.middleware");

router.get("/", userMiddleware.requireAuth, controller.index);
router.post("/order", userMiddleware.requireAuth, controller.order);
router.get("/success/:orderId", userMiddleware.requireAuth, controller.success);
router.post("/webhook", controller.webhook);

module.exports = router;