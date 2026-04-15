const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product-category.model");
const Account = require("../../models/account.model");
const User = require("../../models/user.model");
const Order = require("../../models/order.model");

// [GET] /admin/dashboard
module.exports.index = async (req, res) => {
    const statistic = {
        categoryProduct: { total: 0, active: 0, inactive: 0 },
        product: { total: 0, active: 0, inactive: 0 },
        account: { total: 0, active: 0, inactive: 0 },
        user: { total: 0, active: 0, inactive: 0 },
        order: { total: 0, pending: 0, confirm: 0, shipping: 0, success: 0, cancel: 0 }
    };

    try {
        statistic.categoryProduct.total = await ProductCategory.countDocuments({ deleted: false });
        statistic.categoryProduct.active = await ProductCategory.countDocuments({ status: "active", deleted: false });
        statistic.categoryProduct.inactive = await ProductCategory.countDocuments({ status: "inactive", deleted: false });

        statistic.product.total = await Product.countDocuments({ deleted: false });
        statistic.product.active = await Product.countDocuments({ status: "active", deleted: false });
        statistic.product.inactive = await Product.countDocuments({ status: "inactive", deleted: false });

        statistic.account.total = await Account.countDocuments({ deleted: false });
        statistic.account.active = await Account.countDocuments({ status: "active", deleted: false });
        statistic.account.inactive = await Account.countDocuments({ status: "inactive", deleted: false });

        statistic.user.total = await User.countDocuments({ deleted: false });
        statistic.user.active = await User.countDocuments({ status: "active", deleted: false });
        statistic.user.inactive = await User.countDocuments({ status: "inactive", deleted: false });

        statistic.order.total = await Order.countDocuments({});
        statistic.order.pending = await Order.countDocuments({ status: "pending" });
        statistic.order.success = await Order.countDocuments({ status: "success" });
        statistic.order.cancel = await Order.countDocuments({ status: "cancel" });

    } catch (error) {
        console.error("Lỗi lấy thống kê Dashboard:", error);
    }

    res.render("admin/pages/dashboard/index", {
        pageTitle: "Trang tổng quan",
        statistic: statistic
    });
};