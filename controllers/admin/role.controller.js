const Role = require("../../models/role.model");
const systemConfig = require("../../config/system");

// [GET] /admin/roles
module.exports.index = async (req, res) => {
    let find = { deleted: false };
    
    const records = await Role.find(find);

    res.render("admin/pages/roles/index", {
        pageTitle: "Nhóm quyền",
        records: records
    });
};

// [GET] /admin/roles/create
module.exports.create = async (req, res) => {
    res.render("admin/pages/roles/create", {
        pageTitle: "Tạo nhóm quyền"
    });
};

// [POST] /admin/roles/create
module.exports.createPost = async (req, res) => {
    try {
        const record = new Role(req.body);
        await record.save();
        
        res.json({
            code: 200,
            message: "Tạo nhóm quyền thành công!"
        });
    } catch (error) {
        console.error("Lỗi tạo Role:", error);
        res.json({
            code: 400,
            message: "Đã có lỗi xảy ra, vui lòng thử lại!"
        });
    }
};

// [GET] /admin/roles/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id;
        const data = await Role.findOne({ _id: id, deleted: false });

        res.render("admin/pages/roles/edit", {
            pageTitle: "Chỉnh sửa nhóm quyền",
            data: data
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/roles`);
    }
};

// [PATCH] /admin/roles/edit/:id
module.exports.editPatch = async (req, res) => {
    try {
        const id = req.params.id;
        await Role.updateOne({ _id: id }, req.body);
        
        res.json({
            code: 200,
            message: "Cập nhật nhóm quyền thành công!"
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Cập nhật thất bại!"
        });
    }
};

// [DELETE] /admin/roles/delete/:id
module.exports.deleteItem = async (req, res) => {
    try {
        const id = req.params.id;
        await Role.deleteOne({ _id: id });
        
        res.json({
            code: 200,
            message: "Đã xóa vĩnh viễn nhóm quyền!"
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Xóa thất bại!"
        });
    }
};