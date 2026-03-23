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

module.exports.detail = async(req, res) => {
    try {
        const slug = req.params.slug
        const product = await Product.findOne({
            slug: slug,
            deleted: false,
            status: "active"
        })
        if(!product) {
            return res.redirect("/products")
        }
        product.priceNew = (product.price * (100 - product.discountPercentage) / 100).toFixed(0)
        res.render("client/pages/products/detail.pug", {
            pageTitle: product.title,
            product: product
        })
    } catch(error) {
        res.redirect("/products")
    }
}