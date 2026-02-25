//[GET] /admin/products
const Product = require("../../models/product.model")
const filterStatusHepler = require("../../helpers/filterStatus")

module.exports.index = async (req, res) => {
    const filterStatus = filterStatusHepler(req.query) 

    let find = {
        deleted: false
    }
    if(req.query.status) {
        find.status = req.query.status
    }
    let keyword = ""
    if(req.query.keyword) {
        keyword = req.query.keyword
        find.title = {
            $regex : keyword,
            $options: 'i'
        }
    }
    const products = await Product.find(find)

    // console.log(products)

    res.render("admin/pages/products/index.pug", {
        pageTitle: "Trang danh sách sản phẩm",
        products: products,
        filterStatus: filterStatus,
        keyword :keyword
    })
}