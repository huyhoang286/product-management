//[GET] /admin/products
const Product = require("../../models/product.model")
const filterStatusHepler = require("../../helpers/filterStatus")
const searchHepler = require("../../helpers/search")

module.exports.index = async (req, res) => {
    const filterStatus = filterStatusHepler(req.query) 

    let find = {
        deleted: false
    }
    if(req.query.status) {
        find.status = req.query.status
    }
    //Code Tìm kiếm
    const objectSearch = searchHepler(req.query)
    console.log(objectSearch)
    if(objectSearch.keyword) {
        find.title = objectSearch.regex 
    }

    const products = await Product.find(find)

    // console.log(products)

    res.render("admin/pages/products/index.pug", {
        pageTitle: "Trang danh sách sản phẩm",
        products: products,
        filterStatus: filterStatus,
        keyword :objectSearch.keyword
    })
}