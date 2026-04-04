const Account = require("../../models/account.model");
const Role = require("../../models/role.model");
const md5 = require("md5"); 

// [GET] /admin/accounts
module.exports.index = async (req, res) => {
    let find = { deleted: false };
    
    const records = await Account.find(find).select("-password -token");

    for (const record of records) {
        const role = await Role.findOne({ _id: record.role_id, deleted: false });
        record.role = role;
    }

    res.render("admin/pages/accounts/index", {
        pageTitle: "Danh sách tài khoản",
        records: records
    });
};

// [GET] /admin/accounts/create
module.exports.create = async (req, res) => {
    const roles = await Role.find({ deleted: false });

    res.render("admin/pages/accounts/create", {
        pageTitle: "Tạo mới tài khoản",
        roles: roles
    });
};

// [POST] /admin/accounts/create
module.exports.createPost = async (req, res) => {
    try {
        req.body.password = md5(req.body.password);

        if (req.file) {
            req.body.avatar = `/uploads/${req.file.filename}`;
        }

        const record = new Account(req.body);
        await record.save();

        res.json({
            code: 200,
            message: "Tạo tài khoản thành công!"
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Tạo tài khoản thất bại!"
        });
    }
};

// [GET] /admin/accounts/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id;
        const data = await Account.findOne({ _id: id, deleted: false });
        const roles = await Role.find({ deleted: false });

        res.render("admin/pages/accounts/edit", {
            pageTitle: "Chỉnh sửa tài khoản",
            data: data,
            roles: roles
        });
    } catch (error) {
        res.redirect(`/admin/accounts`);
    }
};

// [PATCH] /admin/accounts/edit/:id
module.exports.editPatch = async (req, res) => {
    try {
        const id = req.params.id;

        if (req.body.password) {
            req.body.password = md5(req.body.password);
        } else {
            delete req.body.password;
        }

        if (req.file) {
            req.body.avatar = `/uploads/${req.file.filename}`;
        }

        await Account.updateOne({ _id: id }, req.body);

        res.json({
            code: 200,
            message: "Cập nhật tài khoản thành công!"
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Cập nhật thất bại!"
        });
    }
};

// [PATCH] /admin/accounts/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    try {
        const status = req.params.status;
        const id = req.params.id;

        await Account.updateOne({ _id: id }, { status: status });

        res.json({
            code: 200,
            message: "Cập nhật trạng thái thành công!"
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Cập nhật thất bại!"
        });
    }
};

// [DELETE] /admin/accounts/delete/:id
module.exports.deleteItem = async (req, res) => {
    try {
        const id = req.params.id;

        await Account.deleteOne({ _id: id });

        res.json({
            code: 200,
            message: "Đã xóa tài khoản!"
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Xóa thất bại!"
        });
    }
};