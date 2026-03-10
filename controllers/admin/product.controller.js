const Product = require("../../models/product.model")
const filterStatusHepler = require("../../helpers/filterStatus")
const searchHepler = require("../../helpers/search")
const paginationHepler = require("../../helpers/pagination")

//[GET] /admin/products
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

//[PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const status = req.params.status
    const id = req.params.id
    
    try{
        await Product.updateOne({_id:id}, {status: status})
        res.json({
            code: 200,
            message: "Cập nhật trạng thái thành công"
        })
    } catch {
        res.json({
            code: 400,
            message: "Cập nhật trạng thái thật bại"
        })
    }
}

//[PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
    try {
        const type = req.body.type
        const ids = req.body.ids

        switch(type) {
            case "active":
                await Product.updateMany({_id: {$in: ids}}, {status: "active"})
                break
            case "inactive":
                await Product.updateMany({_id: {$in: ids}}, {status: "inactive"})
                break
            case "delete-all":
                await Product.updateMany({_id:{$in: ids}}, {deleted: true, deletedAt: new Date()})
                break
            default:
                break
        }
        res.json({
            code: 200,
            message: "Cập nhật trạng thái thành công!"
        })
    } catch (error) {
        res.json({
            code: 400,
            message: "Cập nhật trạng thái thất bại!"
        })
    }
}

//[PATCH] /admin/products/change-multi-trash
module.exports.changeMultiTrash = async (req, res) => {
    try {
        const type = req.body.type
        const ids = req.body.ids

        switch(type) {
            case "restore-all":
                await Product.updateMany(
                    {_id: {$in: ids}}, 
                    {
                        deleted: false, 
                        $unset: {deletedAt:1}
                    }
                )
                break
            case "delete-permanent-all":
                await Product.deleteMany(
                    {_id: {$in: ids}}
                )
                break
            default:
                break
        }
        res.json({
            code: 200,
            message: "Cập nhật trạng thái thành công!"
        })
    } catch (error) {
        res.json({
            code: 400,
            message: "Cập nhật trạng thái thất bại!"
        })
    }
}

//[DELETE] /admin/products/delete/:id
module.exports.deleteItem = async (req, res) => {
    try {
        const id = req.params.id
        await Product.updateOne({_id: id}, {
            deleted: true,
            deletedAt: new Date()
        })

        res.json({
            code: 200,
            message: "Đã chuyển vào thùng rác!"
        })
    } catch (error) {
        res.json({
            code: 400,
            message: "xóa thất bại!"
        })
    }
}

//[GET] /admin/products/trash
module.exports.trash = async (req, res) => {
    const products = await Product.find({deleted: true})
    res.render("admin/pages/products/trash.pug", {
        pageTitle: "Thùng rác",
        products: products
    })
}

//[PATCH] /admin/products/restore/:id
module.exports.restoreItem = async (req, res) => {
    try {
        const id = req.params.id
        await Product.updateOne({_id: id}, {
            deleted: false,
            $unset: {deletedAt: 1}
        })
        res.json({
            code: 200,
            message: "Khôi phục sản phẩm thành công!"
        })
    } catch (error) {
        res.json({
            code: 400,
            message: "Khôi phục sản phẩm thất bại!"
        })
    }
}

//[DELETE] /admin/products/delete-permanent/:id
module.exports.deletePermanent = async (req, res) => {
    try {
        const id = req.params.id
        await Product.deleteOne({_id: id})

        res.json({
            code: 200,
            message: "Xóa sản phầm thành công!"
        })
    } catch (error) {
        res.json({
            code: 400,
            message: "Xóa sản phẩm thất bại!"
        })
    }
}