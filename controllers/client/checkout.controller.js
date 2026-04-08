const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");
const Order = require("../../models/order.model");

// [GET] /checkout
module.exports.index = async (req, res) => {
    try {
        const cartId = req.cookies.cartId;
        const cart = await Cart.findOne({ _id: cartId });

        cart.totalPrice = 0;

        if (cart.products.length > 0) {
            for (const item of cart.products) {
                const productInfo = await Product.findOne({ _id: item.product_id, deleted: false });
                if (productInfo) {
                    const variantInfo = productInfo.variants.find(v => v.id == item.variant_id);
                    productInfo.priceNew = productInfo.price * (1 - productInfo.discountPercentage / 100);
                    item.totalPrice = productInfo.priceNew * item.quantity;
                    
                    item.productInfo = productInfo;
                    item.variantInfo = variantInfo;
                    cart.totalPrice += item.totalPrice;
                }
            }
        }

        res.render("client/pages/checkout/index", {
            pageTitle: "Thanh toán đơn hàng",
            cartDetail: cart
        });
    } catch (error) {
        console.log(error);
        res.redirect("/");
    }
};

// [POST] /checkout/order
module.exports.order = async (req, res) => {
    try {
        const cartId = req.cookies.cartId;
        const { fullName, phone, address, note, payment_method } = req.body;
        
        const cart = await Cart.findOne({ _id: cartId });
        if (!cart || cart.products.length === 0) {
            return res.json({ code: 400, message: "Giỏ hàng của bạn đang trống!" });
        }

        const orderProducts = [];

        for (const item of cart.products) {
            const productInfo = await Product.findOne({ _id: item.product_id, deleted: false });
            
            if (!productInfo) {
                return res.json({ code: 404, message: `Sản phẩm ID ${item.product_id} không tồn tại!` });
            }

            const variant = productInfo.variants.find(v => v.id == item.variant_id);
            
            if (!variant || variant.stock < item.quantity) {
                return res.json({ 
                    code: 400, 
                    message: `Sản phẩm ${productInfo.title} (Size ${variant ? variant.size : '?'}) đã hết hàng hoặc không đủ số lượng!` 
                });
            }

            orderProducts.push({
                product_id: item.product_id,
                variant_id: item.variant_id,
                price: productInfo.price,
                discountPercentage: productInfo.discountPercentage,
                quantity: item.quantity
            });
        }

        // Tạo đơn hàng mới
        const order = new Order({
            cart_id: cartId,
            userInfo: { fullName, phone, address, note },
            products: orderProducts,
            payment_method: payment_method
        });
        await order.save();

        // XỬ LÝ THANH TOÁN ONLINE (DỰ PHÒNG TƯƠNG LAI)
        if (payment_method === "online") {
            // Gọi service Ngân hàng/VNPay ở đây và trả về URL redirect
        }

        // Cập nhật kho
        for (const item of cart.products) {
            await Product.updateOne(
                { _id: item.product_id, "variants._id": item.variant_id },
                { $inc: { "variants.$.stock": -item.quantity } }
            );
        }

        // Làm rỗng giỏ hàng
        await Cart.updateOne({ _id: cartId }, { $set: { products: [] } });

        res.json({
            code: 200,
            message: "Đặt hàng thành công!",
            orderId: order.id
        });

    } catch (error) {
        console.error("Lỗi đặt hàng:", error);
        res.json({ code: 500, message: "Có lỗi xảy ra trong quá trình đặt hàng. Vui lòng thử lại!" });
    }
};

// [GET] /checkout/success/:orderId
module.exports.success = async (req, res) => {
    try {
        const orderId = req.params.orderId;
        const order = await Order.findOne({ _id: orderId });

        order.totalPrice = 0;

        for (const item of order.products) {
            const productInfo = await Product.findOne({ _id: item.product_id }).select("title thumbnail variants");
            
            item.priceNew = item.price * (1 - item.discountPercentage / 100);
            item.totalPrice = item.priceNew * item.quantity;
            order.totalPrice += item.totalPrice;

            if (productInfo) {
                item.productInfo = productInfo;
                item.variantInfo = productInfo.variants.find(v => v.id == item.variant_id);
            }
        }

        res.render("client/pages/checkout/success", {
            pageTitle: "Đặt hàng thành công",
            order: order
        });
    } catch (error) {
        res.redirect("/");
    }
};