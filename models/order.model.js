const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        user_id: String,
        cart_id: String,
        userInfo: {
            fullName: String,
            phone: String,
            address: String,
            note: String
        },
        products: [
            {
                product_id: String,
                variant_id: String,
                price: Number,
                discountPercentage: Number,
                quantity: Number
            }
        ],
        payment_method: { 
            type: String, 
            default: "cod" 
        },
        payment_status: {
            type: String,
            default: "unpaid" 
        },
        payosOrderCode: {
            type: Number 
        },
        totalPrice: Number,      // tổng tiền (Đã trừ giảm giá)
        voucher_id: String,     
        discount_amount: {
        type: Number,
        default: 0
        },
        status: {
            type: String,
            default: "pending" 
        }
    },
    { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema, "orders");
module.exports = Order;