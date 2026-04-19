const mongoose = require("mongoose");

const settingGeneralSchema = new mongoose.Schema(
  {
    websiteName: String,
    logo: String,
    phone: String,
    email: String,
    address: String,
    ourStory: String, 
    productsPerRow: { type: Number, default: 4 },
    productsPerPage: { type: Number, default: 8 },
    banners: [String]
  },
  { timestamps: true }
);

const SettingGeneral = mongoose.model("SettingGeneral", settingGeneralSchema, "settings-general");
module.exports = SettingGeneral;