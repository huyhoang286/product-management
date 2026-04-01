const ProductCategory = require("../../models/product-category.model");
const systemConfig = require("../../config/system");
const createTreeHelper = require("../../helpers/createTree");

// [GET] /admin/products-category
module.exports.index = async (req, res) => {
    try {
        let find = { deleted: false };

        const records = await ProductCategory.find(find).sort({ position: "desc" });

        res.render("admin/pages/products-category/index", {
            pageTitle: "Danh mục sản phẩm",
            records: records
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
    }
};

// [GET] /admin/products-category/create
module.exports.create = async (req, res) => {
    let find = { deleted: false };
    
    const records = await ProductCategory.find(find);
    
    const newRecords = createTreeHelper(records);

    res.render("admin/pages/products-category/create", {
        pageTitle: "Tạo danh mục sản phẩm",
        records: newRecords
    })
}

// [POST] /admin/products-category/create
module.exports.createPost = async (req, res) => {
    try {
        if (req.body.position == "") {
            const count = await ProductCategory.countDocuments();
            req.body.position = count + 1;
        } else {
            req.body.position = parseInt(req.body.position);
        }

        if (req.file) {
            req.body.thumbnail = `/uploads/${req.file.filename}`;
        }

        const record = new ProductCategory(req.body);
        await record.save();

        res.redirect(`${systemConfig.prefixAdmin}/products-category`);
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/products-category/create`);
    }
};