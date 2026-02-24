//[GET] /products
const Product = require("../../models/product.model")

module.exports.index = async (req, res) => {

    const products = await Product.find({
        status: "active",
        deleted: false
    })
    const newProducts = products.map(item => {
        item.newPrice = (item.price*(1-item.discountPercentage/100)).toFixed(2)
        return item
    })

    // console.log(newProducts)

    res.render("client/pages/products/index.pug", {
        pageTitle: "Trang danh sách sản phẩm",
        products: newProducts
    })
}