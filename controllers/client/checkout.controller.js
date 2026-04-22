const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");
const Order = require("../../models/order.model");
const { PayOS } = require("@payos/node");
const User = require("../../models/user.model");
const Voucher = require("../../models/voucher.model");

const payos = new PayOS({
  clientId: process.env.PAYOS_CLIENT_ID,
  apiKey: process.env.PAYOS_API_KEY,
  checksumKey: process.env.PAYOS_CHECKSUM_KEY
});

// [GET] /checkout
module.exports.index = async (req, res) => {
    try {
        const cartId = req.cookies.cartId;
        const cart = await Cart.findOne({ _id: cartId });
        
        let selectedItems = [];
        if (req.query.items) {
            selectedItems = JSON.parse(decodeURIComponent(req.query.items));
        } else {
            return res.redirect("/cart"); 
        }

        cart.totalPrice = 0;
        
        cart.products = cart.products.filter(item => 
            selectedItems.some(s => s.productId == item.product_id && s.variantId == item.variant_id)
        );

        if (cart.products.length > 0) {
            for (const item of cart.products) {
                const productInfo = await Product.findOne({ _id: item.product_id, deleted: false });
                if (productInfo) {
                    const variantInfo = productInfo.variants.find(v => v.id == item.variant_id);
                    productInfo.priceNew = Math.round(productInfo.price * (1 - productInfo.discountPercentage / 100));
                    item.totalPrice = productInfo.priceNew * item.quantity;
                    
                    item.productInfo = productInfo;
                    item.variantInfo = variantInfo;
                    cart.totalPrice += item.totalPrice;
                }
            }
        }

        let userVouchers = [];
        if (res.locals.user) {
            const savedVoucherIds = res.locals.user.vouchers
            .filter(v => v.isUsed === false) // Chỉ lấy các mã chưa sử dụng
            .map(v => v.voucher_id);

            userVouchers = await Voucher.find({
            _id: { $in: savedVoucherIds },
            status: "active",
            deleted: false,
            quantity: { $gt: 0 },
            expireAt: { $gte: new Date() },
            minOrderValue: { $lte: cart.totalPrice }   //Chỉ hiển thị mã đủ điều kiện với đơn này
            });
        }
        res.render("client/pages/checkout/index", {
            pageTitle: "Thanh toán đơn hàng",
            cartDetail: cart,
            selectedItemsString: JSON.stringify(selectedItems),
            vouchers: userVouchers
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
        const { fullName, phone, address, note, payment_method, voucher_id } = req.body;
        
        const cart = await Cart.findOne({ _id: cartId });
        if (!cart || cart.products.length === 0) {
            return res.json({ code: 400, message: "Giỏ hàng của bạn đang trống!" });
        }

        const orderProducts = [];
        let totalPrice = 0;

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

            const priceNew = Math.round(productInfo.price * (1 - productInfo.discountPercentage / 100));
            totalPrice += priceNew * item.quantity;

            orderProducts.push({
                product_id: item.product_id,
                variant_id: item.variant_id,
                price: productInfo.price,
                discountPercentage: productInfo.discountPercentage,
                quantity: item.quantity
            });
        }

        let discountAmount = 0;
        let finalTotalPrice = totalPrice;

        if (voucher_id) {
            const voucher = await Voucher.findOne({
                _id: voucher_id,
                status: "active",
                deleted: false,
                quantity: { $gt: 0 },
                minOrderValue: { $lte: totalPrice } // Đảm bảo đơn hàng đủ điều kiện
            });

            if (!voucher) {
                return res.json({ code: 400, message: "Mã giảm giá không hợp lệ hoặc không đủ điều kiện áp dụng!" });
            }

            // Tính số tiền được giảm
            discountAmount = Math.round((totalPrice * voucher.discountPercentage) / 100);
            finalTotalPrice = totalPrice - discountAmount;

            // Trừ số lượng mã giảm giá trong kho chung
            await Voucher.updateOne(
                { _id: voucher_id },
                { $inc: { quantity: -1 } }
            );

            // Đánh dấu mã này "đã sử dụng" 
            if (res.locals.user) {
                await User.updateOne(
                    { 
                        _id: res.locals.user.id,
                        "vouchers.voucher_id": voucher_id 
                    },
                    { 
                        $set: { "vouchers.$.isUsed": true } 
                    }
                );
            }
        }

        // Tạo đơn hàng mới 
        const orderInfo = {
            cart_id: cartId,
            userInfo: { fullName, phone, address, note },
            products: orderProducts,
            payment_method: payment_method,
            totalPrice: finalTotalPrice, 
            voucher_id: voucher_id || "", 
            discount_amount: discountAmount
        };

        if (res.locals.user) {
            orderInfo.user_id = res.locals.user.id;
        }
        const newOrder = new Order(orderInfo);
        await newOrder.save();
        
        // Cập nhật kho sản phẩm
        for (const item of cart.products) {
            await Product.updateOne(
                { _id: item.product_id, "variants._id": item.variant_id },
                { 
                    $inc: { 
                        "variants.$.stock": -item.quantity, 
                        "sold": item.quantity
                    } 
                }
            );
        }

        // Làm rỗng giỏ hàng
        const selectedItems = JSON.parse(req.body.selectedItemsString);

        await Cart.updateOne(
            { _id: cartId },
            {
                $pull: {
                    products: {
                        $or: selectedItems.map(item => ({ 
                            product_id: item.productId, 
                            variant_id: item.variantId 
                        }))
                    }
                }
            }
        );

        // Xử lý thanh toán nếu chọn VietQR
        if (payment_method === "vietqr") {
            const orderCode = Number(String(Date.now()).slice(-6)); 
            
            await Order.updateOne({ _id: newOrder.id }, { payosOrderCode: orderCode });

            const paymentData = {
                orderCode: orderCode,
                amount: finalTotalPrice, 
                description: `Thanh toan don ${newOrder.id.slice(-4)}`,
                returnUrl: `${process.env.CLIENT_URL}/checkout/success/${newOrder.id}`,
                cancelUrl: `${process.env.CLIENT_URL}/checkout/cancel/${newOrder.id}`,
            };

            const paymentLink = await payos.paymentRequests.create(paymentData);

            return res.json({
                code: 200,
                message: "Tạo link thanh toán thành công!",
                data: {
                    paymentUrl: paymentLink.checkoutUrl,
                    orderId: newOrder.id
                }
            });
        }

        return res.json({
            code: 200,
            message: "Đặt hàng thành công!",
            data: {
                orderId: newOrder.id
            }
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

        for (const item of order.products) {
            const productInfo = await Product.findOne({ _id: item.product_id }).select("title thumbnail variants");
            
            item.priceNew = Math.round(item.price * (1 - item.discountPercentage / 100));
            item.totalPrice = item.priceNew * item.quantity;
            

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

// [POST] /checkout/webhook
module.exports.webhook = async (req, res) => {
    try {
        const webhookData = req.body;
        // console.log("Dữ liệu webhook nhận được:", webhookData);
        const verifiedData = await payos.webhooks.verify(webhookData);
        // console.log("Dữ liệu đã xác thực:", verifiedData);

        const updateResult = await Order.updateOne(
            { payosOrderCode: verifiedData.orderCode },
            { 
                payment_status: "paid", 
                status: "confirm" 
            }
        );
        // console.log(updateResult);
        return res.json({
            success: true,
            message: "Webhook xử lý thành công!"
        });
            
    } catch (error) {
        console.error("Lỗi xử lý webhook:", error.message);
        return res.json({ success: false, message: "Lỗi hệ thống hoặc sai chữ ký" });
    }
};