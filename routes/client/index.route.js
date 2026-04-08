const homeRoutes = require("./home.route")
const productRoutes = require("./product.route")
const cartRoutes = require("./cart.route");
const cartMiddleware = require("../../middlewares/client/cart.middleware");
const checkoutRoutes = require("./checkout.route");
const userRoutes = require("./user.route");
const userMiddleware = require("../../middlewares/client/user.middleware");
const categoryMiddleware = require("../../middlewares/client/category.middleware");

module.exports = (app) => {
    app.use(cartMiddleware.cartId);
    app.use(userMiddleware.infoUser);
    app.use(categoryMiddleware.category);

    app.use('/', homeRoutes);

    app.use('/products', productRoutes);
    app.use("/cart", cartRoutes);
    app.use('/checkout', checkoutRoutes);
    app.use('/user', userRoutes);
    
}