const Product = require("../../models/product.model");
const Voucher = require("../../models/voucher.model");
const SettingGeneral = require("../../models/setting-general.model");

// [GET] /
module.exports.index = async (req, res) => {
    try {
        const settingGeneral = await SettingGeneral.findOne({});
        const limitBestSelling = settingGeneral?.productsHomeBestSeller || 8;
        const limitNew = settingGeneral?.productsHomeNew || 8;

        // Lấy Sản phẩm bán chạy
        const productsBestSelling = await Product.aggregate([
            { $match: { status: "active", deleted: false } },
            { $sort: { sold: -1 } }, 
            {
                $group: {
                    _id: { $ifNull: ["$styleCode", "$_id"] }, 
                    doc: { $first: "$$ROOT" }
                }
            },
            { $replaceRoot: { newRoot: "$doc" } },
            {
                $addFields: {
                    priceNew: {
                        $round: [
                            { $multiply: [ "$price", { $divide: [ { $subtract: [100, "$discountPercentage"] }, 100 ] } ] },
                            0
                        ]
                    }
                }
            },
            { $sort: { sold: -1 } }, 
            { $limit: limitBestSelling } 
        ]);

        // Lấy Sản phẩm mới nhất 
        const productsNew = await Product.aggregate([
            { $match: { status: "active", deleted: false } },
            { $sort: { createdAt: -1 } }, 
            {
                $group: {
                    _id: { $ifNull: ["$styleCode", "$_id"] },
                    doc: { $first: "$$ROOT" }
                }
            },
            { $replaceRoot: { newRoot: "$doc" } },
            {
                $addFields: {
                    priceNew: {
                        $round: [
                            { $multiply: [ "$price", { $divide: [ { $subtract: [100, "$discountPercentage"] }, 100 ] } ] },
                            0
                        ]
                    }
                }
            },
            { $sort: { createdAt: -1 } },
            { $limit: limitNew }
        ]);

        // Lấy mã giảm giá
        const vouchers = await Voucher.find({
            status: "active",
            deleted: false,
            expireAt: { $gte: new Date() }, 
            quantity: { $gt: 0 }            
        }).sort({ discountPercentage: "desc" }); // Sắp xếp ưu tiên mã giảm nhiều nhất hiện trước

        res.render("client/pages/home/index.pug", {
            pageTitle: "Trang chủ",
            productsBestSelling: productsBestSelling,
            productsNew: productsNew,
            vouchers: vouchers
        });
    } catch (error) {
        console.error(error);
        res.redirect("/products");
    }
};
