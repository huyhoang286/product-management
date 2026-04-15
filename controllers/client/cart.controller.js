const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");

module.exports.index = async (req, res) => {
    try {
        const cartId = req.cookies.cartId;
        const cart = await Cart.findOne({ _id: cartId });

        cart.totalPrice = 0;

        if (cart.products.length > 0) {
            for (const item of cart.products) {
                const productId = item.product_id;
                const variantId = item.variant_id;

                const productInfo = await Product.findOne({ 
                    _id: productId,
                    deleted: false
                });

                if (productInfo) {
                    const variantInfo = productInfo.variants.find(v => v.id == variantId);

                    productInfo.priceNew = Math.round(productInfo.price * (1 - productInfo.discountPercentage / 100));
                    item.totalPrice = productInfo.priceNew * item.quantity;
                    
                    item.productInfo = productInfo;
                    item.variantInfo = variantInfo;

                    cart.totalPrice += item.totalPrice;
                }
            }
        }

        res.render("client/pages/cart/index", {
            pageTitle: "Giỏ hàng của bạn",
            cartDetail: cart
        });
    } catch (error) {
        console.log(error);
        res.redirect("back");
    }
};

// [POST] /cart/add/:productId
module.exports.addPost = async (req, res) => {
  try {
    const cartId = req.cookies.cartId;
    const productId = req.params.productId;
    const quantity = parseInt(req.body.quantity);
    const variantId = req.body.variant_id; 

    const productInfo = await Product.findOne({ _id: productId });
    const variantInfo = productInfo.variants.find(v => v.id == variantId);

    if (!variantInfo) {
      return res.json({ code: 400, message: "Biến thể sản phẩm không tồn tại!" });
    }

    const cart = await Cart.findOne({ _id: cartId });
    const existProductInCart = cart.products.find(
      (item) => item.product_id == productId && item.variant_id == variantId
    );

    const currentQuantityInCart = existProductInCart ? existProductInCart.quantity : 0;
    const totalRequestedQuantity = currentQuantityInCart + quantity;

    if (totalRequestedQuantity > variantInfo.stock) {
      return res.json({ 
        code: 400, 
        message: `Lỗi! Chúng tôi chỉ còn tối đa ${variantInfo.stock} sản phẩm này.. Bạn đang có ${currentQuantityInCart} sản phẩm trong giỏ.` 
      });
    }

    if (existProductInCart) {
      const newQuantity = existProductInCart.quantity + quantity;
      
      await Cart.updateOne(
        { 
          _id: cartId, 
          "products.product_id": productId, 
          "products.variant_id": variantId 
        },
        {
          $set: { "products.$.quantity": newQuantity },
        }
      );
    } else {
      const objectCart = {
        product_id: productId,
        variant_id: variantId, 
        quantity: quantity
      };
      
      await Cart.updateOne(
        { _id: cartId },
        {
          $push: { products: objectCart },
        }
      );
    }

    res.json({
      code: 200,
      message: "Đã thêm sản phẩm vào giỏ hàng!"
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi! Không thể thêm vào giỏ hàng."
    });
  }
};

// [PATCH] /cart/update/:productId
module.exports.updatePatch = async (req, res) => {
    try {
        const cartId = req.cookies.cartId;
        const productId = req.params.productId;
        const quantity = parseInt(req.body.quantity);
        const variantId = req.body.variant_id;

        const productInfo = await Product.findOne({ _id: productId });
        const variantInfo = productInfo.variants.find(v => v.id == variantId);

        if (quantity > variantInfo.stock) {
            return res.json({ 
                code: 400, 
                message: `Lỗi! Chúng tôi chỉ còn tối đa ${variantInfo.stock} sản phẩm này.` 
            });
        }

        await Cart.updateOne(
            { 
                _id: cartId, 
                "products.product_id": productId,
                "products.variant_id": variantId
            },
            {
                $set: { "products.$.quantity": quantity }
            }
        );

        res.json({
            code: 200,
            message: "Cập nhật số lượng thành công!"
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Cập nhật số lượng thất bại!"
        });
    }
};

// [DELETE] /cart/delete/:productId
module.exports.deleteItem = async (req, res) => {
    try {
        const cartId = req.cookies.cartId;
        const productId = req.params.productId;
        const variantId = req.body.variant_id; 

        await Cart.updateOne(
            { _id: cartId },
            {
                $pull: {
                    products: {
                        product_id: productId,
                        variant_id: variantId
                    }
                }
            }
        );

        res.json({
            code: 200,
            message: "Đã xóa sản phẩm khỏi giỏ hàng!"
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Xóa sản phẩm thất bại!"
        });
    }
};

// [DELETE] /cart/delete-multiple
module.exports.deleteMultiple = async (req, res) => {
    try {
        const cartId = req.cookies.cartId;
        const items = req.body.items; 

        if (!items || items.length === 0) {
            return res.json({ code: 400, message: "Không có sản phẩm nào được chọn!" });
        }

        await Cart.updateOne(
            { _id: cartId },
            {
                $pull: {
                    products: { $or: items }
                }
            }
        );

        res.json({
            code: 200,
            message: "Đã xóa các sản phẩm đã chọn!"
        });
    } catch (error) {
        console.error(error);
        res.json({
            code: 400,
            message: "Xóa sản phẩm thất bại!"
        });
    }
};