const Cart = require("../../models/cart.model");

module.exports.cartId = async (req, res, next) => {
  let cartId = req.cookies.cartId;
  let cart = null;

  if (cartId) {
    cart = await Cart.findOne({ _id: cartId });
  }

  if (!cart) {
    const newCart = new Cart();
    await newCart.save();

    const expiresTime = 1000 * 60 * 60 * 24 * 365; 
    res.cookie("cartId", newCart.id, {
      expires: new Date(Date.now() + expiresTime),
    });
  } else {
    cart.totalQuantity = cart.products.reduce((sum, item) => sum + item.quantity, 0);
    res.locals.miniCart = cart;
  }

  next();
};