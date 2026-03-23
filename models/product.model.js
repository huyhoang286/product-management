const mongoose = require("mongoose");
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

const productSchema = new mongoose.Schema(
    {
        title: String,
        styleCode: String, 
        color: String,    
        product_category_id: {
            type: String,
            default: ""
        },
        description: String,
        price: Number,
        discountPercentage: Number,
        thumbnail: String,
        images: Array,
        
        attributes: {
            brand: String,
            surface: String,
            position: String
        },

        variants: [
            {
                size: String,
                stock: Number
            }
        ],

        status: { type: String, default: "active" },
        slug: { type: String, slug: "title", unique: true },
        deleted: { type: Boolean, default: false },
        deletedAt: Date
    },
    { timestamps: true }
);

const Product = mongoose.model("Product", productSchema, "products");
module.exports = Product;