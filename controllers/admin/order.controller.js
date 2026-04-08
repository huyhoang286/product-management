const Order = require("../../models/order.model");
const Product = require("../../models/product.model");  

// [GET] /admin/orders
module.exports.index = async (req, res) => {
    try {
        const orders = await Order.find({ deleted: false }).sort({ createdAt: "desc" });

        for (const order of orders) {
            let totalPrice = 0;
            for (const item of order.products) {
                const priceNew = Math.round(item.price * (1 - item.discountPercentage / 100));
                totalPrice += priceNew * item.quantity;
            }
            order.totalPrice = totalPrice;
        }

        res.render("admin/pages/orders/index", {
            pageTitle: "Quản lý đơn hàng",
            orders: orders
        });
    } catch (error) {
        console.log(error);
        res.redirect("back");
    }
};

// [PATCH] /admin/orders/change-status/:id
module.exports.changeStatusPatch = async (req, res) => {
    try {
        const id = req.params.id;
        const status = req.body.status;

        await Order.updateOne(
            { _id: id },
            { status: status }
        );

        res.json({ code: 200, message: "Cập nhật trạng thái thành công!" });
    } catch (error) {
        res.json({ code: 500, message: "Lỗi cập nhật!" });
    }
};

// [GET] /admin/orders/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const id = req.params.id;
        const order = await Order.findOne({ _id: id, deleted: false });

        if (!order) {
            return res.redirect("back");
        }

        let totalOrderPrice = 0;
        for (const item of order.products) {
            const productInfo = await Product.findOne({ _id: item.product_id }).select("title thumbnail variants");
            
            item.priceNew = Math.round(item.price * (1 - item.discountPercentage / 100));
            item.totalPrice = item.priceNew * item.quantity;
            totalOrderPrice += item.totalPrice;

            if (productInfo) {
                item.productInfo = productInfo;
                item.variantInfo = productInfo.variants.find(v => v.id == item.variant_id);
            }
        }

        order.totalOrderPrice = totalOrderPrice;

        res.render("admin/pages/orders/detail", {
            pageTitle: "Chi tiết đơn hàng",
            order: order
        });
    } catch (error) {
        console.log(error);
        res.redirect("back");
    }
};