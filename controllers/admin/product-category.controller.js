const ProductCategory = require("../../models/product-category.model");
const systemConfig = require("../../config/system");
const createTreeHelper = require("../../helpers/createTree");

// [GET] /admin/products-category
module.exports.index = async (req, res) => {
    try {
        let find = { deleted: false };

        const records = await ProductCategory.find(find).sort({ position: "desc" });

        const newRecords = createTreeHelper(records);

        res.render("admin/pages/products-category/index", {
            pageTitle: "Danh mục sản phẩm",
            records: newRecords // Trả ra mảng đã thành cây
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/dashboard`)
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


// [GET] /admin/products-category/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id;
        
        const data = await ProductCategory.findOne({ _id: id, deleted: false });

        const records = await ProductCategory.find({ deleted: false });
        const newRecords = createTreeHelper(records);

        res.render("admin/pages/products-category/edit", {
            pageTitle: "Chỉnh sửa danh mục",
            data: data,
            records: newRecords
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/products-category`);
    }
};

// [PATCH] /admin/products-category/edit/:id
module.exports.editPatch = async (req, res) => {
    try {
        const id = req.params.id;
        
        if(req.body.position) {
            req.body.position = parseInt(req.body.position);
        }

        if (req.file) {
            req.body.thumbnail = `/uploads/${req.file.filename}`;
        }

        await ProductCategory.updateOne({ _id: id }, req.body);

        res.json({
            code: 200,
            message: "Cập nhật danh mục thành công!"
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Cập nhật thất bại!"
        });
    }
};

// [DELETE] /admin/products-category/delete/:id
module.exports.deleteItem = async (req, res) => {
    try {
        const id = req.params.id;
        
        await ProductCategory.deleteOne(
            { _id: id }
        );

        res.json({
            code: 200,
            message: "Xóa thành công!"
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Lỗi không xóa được!"
        });
    }
};

// [PATCH] /admin/products-category/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    try {
        const status = req.params.status;
        const id = req.params.id;

        await ProductCategory.updateOne({ _id: id }, { status: status });

        res.json({
            code: 200,
            message: "Cập nhật trạng thái thành công!"
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Lỗi không cập nhật được trạng thái!"
        });
    }
};