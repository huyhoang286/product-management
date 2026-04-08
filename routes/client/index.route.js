const homeRoutes = require("./home.route")
const productRoutes = require("./product.route")
const cartRoutes = require("./cart.route");
const cartMiddleware = require("../../middlewares/client/cart.middleware");
const checkoutRoutes = require("./checkout.route");

module.exports = (app) => {
    app.use(cartMiddleware.cartId);
    app.use('/', homeRoutes);

    app.use('/products', productRoutes);
    app.use("/cart", cartRoutes);
    app.use('/checkout', checkoutRoutes);
    
}