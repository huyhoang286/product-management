const User = require("../../models/user.model");

module.exports.infoUser = async (req, res, next) => {
    if (req.cookies.tokenUser) {
        const user = await User.findOne({
            tokenUser: req.cookies.tokenUser,
            deleted: false,
            status: "active"
        }).select("-password"); // Không lấy field password ra

        if (user) {
            res.locals.user = user; 
        }
    }
    next();
};

module.exports.requireAuth = async (req, res, next) => {
    if (!req.cookies.tokenUser) {
        return res.redirect("/user/login");
    }

    const user = await User.findOne({
        tokenUser: req.cookies.tokenUser,
        deleted: false,
        status: "active"
    });

    if (!user) {
        res.clearCookie("tokenUser");
        return res.redirect("/user/login");
    }

    next();
};