//[GET] /admin/products
const Product = require("../../models/product.model")
const filterStatusHepler = require("../../helpers/filterStatus")
const searchHepler = require("../../helpers/search")
const paginationHepler = require("../../helpers/pagination")

module.exports.index = async (req, res) => {
    const filterStatus = filterStatusHepler(req.query)

    let find = {
        deleted: false
    }
    if (req.query.status) {
        find.status = req.query.status
    }

    //Search
    const objectSearch = searchHepler(req.query)
    if (objectSearch.keyword) {
        find.title = objectSearch.regex
    }
    //End Search

    //Pagination
    const countProducts = await Product.countDocuments(find)
    let objectPagination = paginationHepler(
        {
        currentPage: 1,
        limitItems: 5
        },
        req.query,
        countProducts
    )
    //End Pagination

    const products = await Product.find(find)
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip)


    // console.log(products)

    //render
    res.render("admin/pages/products/index.pug", {
        pageTitle: "Trang danh sách sản phẩm",
        products: products,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination
    })
}