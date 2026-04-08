const ProductCategory = require("../../models/product-category.model");
const createTreeHelper = require("../../helpers/createTree");

module.exports.category = async (req, res, next) => {
    try {
        const productsCategory = await ProductCategory.find({
            deleted: false,
            status: "active"
        });

        const newProductsCategory = createTreeHelper(productsCategory);

        res.locals.layoutProductsCategory = newProductsCategory;

        next();
    } catch (error) {
        console.log(error);
        next();
    }
};