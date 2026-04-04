const systemConfig = require("../../config/system")

const dashboardRoute = require("./dashboard.route")
const productRoute = require("./product.route")
const productCategoryRoutes = require("./product-category.route")
const roleRoutes = require("./role.route");

module.exports = (app) => {
    const PATH_ADMIN = systemConfig.prefixAdmin
    app.use(PATH_ADMIN + "/dashboard", dashboardRoute)
    app.use(PATH_ADMIN + "/products", productRoute)
    app.use(PATH_ADMIN + "/products-category", productCategoryRoutes)
    app.use(PATH_ADMIN + "/roles", roleRoutes);
}