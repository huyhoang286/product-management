const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/cart.controller");

router.get("/", controller.index);
router.post("/add/:productId", controller.addPost);
router.patch("/update/:productId", controller.updatePatch);
router.delete("/delete/:productId", controller.deleteItem);

module.exports = router;