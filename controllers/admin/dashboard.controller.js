const ProductCategory = require("../../models/product-category.model");
const Product = require("../../models/product.model");
const Account = require("../../models/account.model");
const User = require("../../models/user.model");
const Order = require("../../models/order.model");
const Voucher = require("../../models/voucher.model");

// [GET] /admin/dashboard
module.exports.index = async (req, res) => {
  try {
    // Khởi tạo Object chứa toàn bộ dữ liệu thống kê
    const statistic = {
      categoryProduct: { total: 0, active: 0, inactive: 0 },
      product: { total: 0, active: 0, inactive: 0 },
      account: { total: 0, active: 0, inactive: 0 },
      user: { total: 0, active: 0, inactive: 0 },
      voucher: { total: 0, active: 0, inactive: 0 },
      order: {
        total: 0,
        pending: 0,
        confirm: 0,
        delivering: 0,
        success: 0,
        cancel: 0,
        totalRevenue: 0,     
        totalDiscount: 0,    
        monthlyRevenue: []   
      }
    };

    const [products, categories, accounts, users, vouchers, orders] = await Promise.all([
      Product.find({ deleted: false }),
      ProductCategory.find({ deleted: false }),
      Account.find({ deleted: false }),
      User.find({ deleted: false }),
      Voucher.find({ deleted: false }),
      Order.find({})
    ]);


    // 1. Thống kê Sản phẩm
    statistic.product.total = products.length;
    statistic.product.active = products.filter(i => i.status === "active").length;
    statistic.product.inactive = products.filter(i => i.status === "inactive").length;

    // 2. Thống kê Danh mục
    statistic.categoryProduct.total = categories.length;
    statistic.categoryProduct.active = categories.filter(i => i.status === "active").length;
    statistic.categoryProduct.inactive = categories.filter(i => i.status === "inactive").length;

    // 3. Thống kê Tài khoản Admin
    statistic.account.total = accounts.length;
    statistic.account.active = accounts.filter(i => i.status === "active").length;
    statistic.account.inactive = accounts.filter(i => i.status === "inactive").length;

    // 4. Thống kê Khách hàng (User)
    statistic.user.total = users.length;
    statistic.user.active = users.filter(i => i.status === "active").length;
    statistic.user.inactive = users.filter(i => i.status === "inactive").length;

    // 5. Thống kê Voucher
    statistic.voucher.total = vouchers.length;
    statistic.voucher.active = vouchers.filter(i => i.status === "active").length;
    statistic.voucher.inactive = vouchers.filter(i => i.status === "inactive").length;

    // 6. Thống kê Đơn hàng & Tính toán Tài chính
    statistic.order.total = orders.length;
    const monthlyMap = {}; // Object tạm để gom nhóm tiền theo tháng

    orders.forEach(order => {
      // Đếm số lượng đơn hàng theo từng trạng thái (pending, confirm, success,...)
      if (statistic.order.hasOwnProperty(order.status)) {
        statistic.order[order.status]++;
      }

      // CHỈ TÍNH DOANH THU KHI ĐƠN HÀNG HOÀN THÀNH (SUCCESS)
      if (order.status === "success") {
        statistic.order.totalRevenue += (order.totalPrice || 0);
        statistic.order.totalDiscount += (order.discount_amount || 0);

        const date = new Date(order.createdAt);
        const month = date.getMonth() + 1; 
        const year = date.getFullYear();
        const key = `Tháng ${month}/${year}`;
        
        monthlyMap[key] = (monthlyMap[key] || 0) + (order.totalPrice || 0);
      }
    });

    // Chuyển dữ liệu Object tháng thành mảng (Array) để View (Pug) dễ dàng lặp và hiển thị
    statistic.order.monthlyRevenue = Object.keys(monthlyMap).map(key => {
      return {
        label: key,
        value: monthlyMap[key]
      };
    }).sort((a, b) => {
      const [m1, y1] = a.label.replace('Tháng ', '').split('/');
      const [m2, y2] = b.label.replace('Tháng ', '').split('/');
      return new Date(y1, m1 - 1) - new Date(y2, m2 - 1);
    });


    // Render ra giao diện
    res.render("admin/pages/dashboard/index", {
      pageTitle: "Bảng điều khiển hệ thống",
      statistic: statistic
    });

  } catch (error) {
    console.error("Lỗi trang Dashboard Admin:", error);
    res.redirect(`${process.env.PREFIX_ADMIN}/auth/login`);
  }
};