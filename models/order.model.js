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
        payment_method: String,
        status: {
            type: String,
            default: "pending" 
        },
        deleted: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema, "orders");
module.exports = Order;