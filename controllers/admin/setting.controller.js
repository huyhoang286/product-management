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
        
        if (req.files && req.files["logo"]) {
            req.body.logo = `/uploads/${req.files["logo"][0].filename}`;
        }

        let finalBanners = [];
        let newBannerFiles = (req.files && req.files["banners"]) ? req.files["banners"] : [];
        let fileIndex = 0;

        let bannerUrls = req.body.bannerUrls || [];
        if (!Array.isArray(bannerUrls)) bannerUrls = [bannerUrls];

        for (let i = 0; i < bannerUrls.length; i++) {
            if (bannerUrls[i] !== "") {
                // Nếu chứa URL -> Admin giữ lại ảnh cũ ở vị trí này
                finalBanners.push(bannerUrls[i]);
            } else {
                // Nếu rỗng -> Admin đã chọn tải lên 1 file mới ở vị trí này
                if (newBannerFiles[fileIndex]) {
                    finalBanners.push(`/uploads/${newBannerFiles[fileIndex].filename}`);
                    fileIndex++;
                }
            }
        }

        req.body.banners = finalBanners;
        delete req.body.bannerUrls;

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