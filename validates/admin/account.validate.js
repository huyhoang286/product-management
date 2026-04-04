const Account = require("../../models/account.model");

// [POST] /admin/accounts/create
module.exports.createPost = async (req, res, next) => {
    if (req.body.phone) {
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(req.body.phone)) {
            return res.json({ code: 400, message: "Số điện thoại không hợp lệ! Vui lòng nhập đúng 10 chữ số." });
        }
    }

    const emailExist = await Account.findOne({ email: req.body.email, deleted: false });
    if (emailExist) {
        return res.json({ code: 400, message: "Email này đã được đăng ký!" });
    }

    next();
};

// [PATCH] /admin/accounts/edit/:id
module.exports.editPatch = async (req, res, next) => {
    const id = req.params.id;

    if (req.body.phone) {
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(req.body.phone)) {
            return res.json({ code: 400, message: "Số điện thoại không hợp lệ! Vui lòng nhập đúng 10 chữ số." });
        }
    }

    const emailExist = await Account.findOne({ 
        _id: { $ne: id }, 
        email: req.body.email, 
        deleted: false 
    });

    if (emailExist) {
        return res.json({ code: 400, message: "Email này đã tồn tại trong hệ thống!" });
    }

    next();
};