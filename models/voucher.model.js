const mongoose = require("mongoose");

const voucherSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true }, 
    discountPercentage: { type: Number, required: true }, 
    minOrderValue: { type: Number, default: 0 }, 
    quantity: { type: Number, default: 0 }, 
    expireAt: { type: Date, required: true }, 
    description: String,
    status: { type: String, default: "active" }, 
    deleted: { type: Boolean, default: false },
    deletedAt: Date,
  },
  { timestamps: true }
);

const Voucher = mongoose.model("Voucher", voucherSchema, "vouchers");

module.exports = Voucher;