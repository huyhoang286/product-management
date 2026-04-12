const Product = require("../../models/product.model");
const User = require("../../models/user.model");
const Order = require("../../models/order.model");

// [GET] /admin/dashboard
module.exports.index = async (req, res) => {
    try {
        const statistic = {
            product: { total: 0, active: 0, inactive: 0 },
            user: { total: 0, active: 0, inactive: 0 },
            order: { total: 0, success: 0, cancel: 0, pending: 0, totalRevenue: 0 }
        };

        // Thống kê Sản phẩm
        statistic.product.total = await Product.countDocuments({ deleted: false });
        statistic.product.active = await Product.countDocuments({ status: "active", deleted: false });
        statistic.product.inactive = await Product.countDocuments({ status: "inactive", deleted: false });

        // Thống kê Khách hàng
        statistic.user.total = await User.countDocuments({ deleted: false });
        statistic.user.active = await User.countDocuments({ status: "active", deleted: false });
        statistic.user.inactive = await User.countDocuments({ status: "inactive", deleted: false });

        // Thống kê Đơn hàng & Tính Doanh Thu
        const orders = await Order.find({ deleted: false });
        statistic.order.total = orders.length;

        let totalRevenue = 0;
        
        let revenueByMonth = new Array(12).fill(0); // mảng 12 tháng

        for (const order of orders) {
            if (order.status === "success") {
                statistic.order.success++;

                let orderRevenue = 0;
                for (const item of order.products) {
                    const priceNew = Math.round(item.price * (1 - item.discountPercentage / 100));
                    orderRevenue += priceNew * item.quantity;
                }
                
                totalRevenue += orderRevenue;

                // Lấy tháng của đơn hàng 
                const month = new Date(order.createdAt).getMonth();
                revenueByMonth[month] += orderRevenue;

            } else if (order.status === "cancel") {
                statistic.order.cancel++;
            } else {
                // Các trạng thái còn lại 
                statistic.order.pending++; 
            }
        }
        statistic.order.totalRevenue = totalRevenue;

        res.render("admin/pages/dashboard/index", {
            pageTitle: "Trang Tổng Quan",
            statistic: statistic,
            revenueByMonth: JSON.stringify(revenueByMonth) 
        });

    } catch (error) {
        console.log(error);
        res.redirect("back");
    }
};