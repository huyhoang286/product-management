const systemConfig = require("../../config/system");
const Account = require("../../models/account.model");
const Role = require("../../models/role.model");

module.exports.requireAuth = async (req, res, next) => {
    if (!req.cookies.token) {
        res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
        return; 
    }

    const user = await Account.findOne({ token: req.cookies.token, deleted: false });

    if (!user) {
        res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
        return;
    }

    const role = await Role.findOne({ _id: user.role_id }).select("title permissions");

    res.locals.user = user;
    res.locals.role = role;

    next();
};

module.exports.requirePermission = (permission) => {
    return (req, res, next) => {
        if (!res.locals.role.permissions.includes(permission)) {
            
            if (req.method === "GET") {
                res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
                return;
            } else {
                res.json({ code: 403, message: "Lỗi 403: Bạn không có quyền thực hiện hành động này!" });
                return;
            }

        }
        
        next();
    };
};