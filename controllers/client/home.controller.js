const Product = require("../../models/product.model");

// [GET] /
module.exports.index = async (req, res) => {
    try {
        // danh sách sản phẩm nổi bật (Ưu tiên giảm giá nhiều nhất)
        const productsFeatured = await Product.find({
            deleted: false,
            status: "active"
        }).sort({ discountPercentage: "desc" }).limit(6);

        productsFeatured.forEach(item => {
            item.priceNew = Math.round(item.price * (1 - item.discountPercentage / 100));
        });

        // lấy ra danh sách sản phẩm mới nhất 
        const productsNew = await Product.find({
            deleted: false,
            status: "active"
        }).sort({ createdAt: "desc" }).limit(6);

        productsNew.forEach(item => {
            item.priceNew = Math.round(item.price * (1 - item.discountPercentage / 100));
        });

        res.render("client/pages/home/index", {
            pageTitle: "Trang chủ",
            productsFeatured: productsFeatured,
            productsNew: productsNew
        });
    } catch (error) {
        console.log(error);
        res.redirect("back");
    }
};