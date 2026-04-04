const Account = require("../../models/account.model");
const md5 = require("md5");
const systemConfig = require("../../config/system");

// [GET] /admin/auth/login
module.exports.login = (req, res) => {
    res.render("admin/pages/auth/login", {
        pageTitle: "Đăng nhập hệ thống"
    });
};

// [POST] /admin/auth/login
module.exports.loginPost = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const user = await Account.findOne({ email: email, deleted: false });

        if (!user) {
            return res.json({ code: 400, message: "Email không tồn tại!" });
        }

        if (md5(password) !== user.password) {
            return res.json({ code: 400, message: "Sai mật khẩu!" });
        }

        if (user.status !== "active") {
            return res.json({ code: 400, message: "Tài khoản đã bị khóa!" });
        }

        if (!user.token) {
            user.token = md5(user.email + Date.now());
            await Account.updateOne({ _id: user.id }, { token: user.token });
        }

        res.cookie("token", user.token, { maxAge: 30 * 24 * 60 * 60 * 1000 });

        res.json({
            code: 200,
            message: "Đăng nhập thành công!"
        });
    } catch (error) {
        res.json({ code: 400, message: "Lỗi hệ thống!" });
    }
};

// [GET] /admin/auth/logout
module.exports.logout = (req, res) => {
    res.clearCookie("token");
    res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
};