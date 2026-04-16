const express = require("express");
const multer = require("multer");
const router = express.Router();
const storageMulter = require("../../helpers/storageMulter");
const upload = multer({ storage: storageMulter() });

const controller = require("../../controllers/admin/setting.controller");

router.get("/general", controller.general);

router.patch("/general", upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'banner1', maxCount: 1 },
    { name: 'banner2', maxCount: 1 },
    { name: 'banner3', maxCount: 1 }
]), controller.generalPatch);

module.exports = router;