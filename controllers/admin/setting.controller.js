const SettingGeneral = require("../../models/setting-general.model");
const systemConfig = require("../../config/system");

// [GET] /admin/settings/general
module.exports.general = async (req, res) => {
    let settingGeneral = await SettingGeneral.findOne({});
    
    if (!settingGeneral) {
        settingGeneral = new SettingGeneral();
        await settingGeneral.save();
    }

    res.render("admin/pages/settings/general", {
        pageTitle: "Cấu hình chung",
        settingGeneral: settingGeneral
    });
};

// [PATCH] /admin/settings/general
module.exports.generalPatch = async (req, res) => {
    try {
        const settingGeneral = await SettingGeneral.findOne({});
        
        let banners = ["", "", ""];
        if (settingGeneral && Array.isArray(settingGeneral.banners) && settingGeneral.banners.length > 0) {
            banners = [...settingGeneral.banners];
        }

        if (req.files) {
            if (req.files["logo"]) req.body.logo = `/uploads/${req.files["logo"][0].filename}`;
            
            if (req.files["banner1"]) banners[0] = `/uploads/${req.files["banner1"][0].filename}`;
            if (req.files["banner2"]) banners[1] = `/uploads/${req.files["banner2"][0].filename}`;
            if (req.files["banner3"]) banners[2] = `/uploads/${req.files["banner3"][0].filename}`;
        }

        req.body.banners = banners;

        if (settingGeneral) {
            await SettingGeneral.updateOne({ _id: settingGeneral.id }, req.body);
        } else {
            const record = new SettingGeneral(req.body);
            await record.save();
        }

        res.redirect(`${systemConfig.prefixAdmin}/settings/general`);
    } catch (error) {
        console.error("Lỗi cập nhật cấu hình:", error);
        res.redirect(`${systemConfig.prefixAdmin}/settings/general`);
    }
};