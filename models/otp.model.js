const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
    email: String,
    otp: String,
    expireAt: {
        type: Date,
        expires: 180 
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model("Otp", otpSchema, "otps");