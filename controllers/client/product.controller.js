//[GET] /products
const Product = require("../../models/product.model")

module.exports.index = async (req, res) => {
    try {
        const products = await Product.aggregate([
            {
                $match: {
                    status: "active",
                    deleted: false
                }
            },
            {
                $group: {
                    _id: { $ifNull: ["$styleCode", "$_id"] },
                    doc: { $first: "$$ROOT" } 
                }
            },
            {
                $replaceRoot: { newRoot: "$doc" }
            },
            {
                $sort: { createdAt: -1 }
            }
        ]);

        products.forEach(item => {
            item.newPrice = Math.round((item.price * (100 - item.discountPercentage) / 100).toFixed(0));
        });

        res.render("client/pages/products/index.pug", {
            pageTitle: "Danh sách sản phẩm",
            products: products
        });
    } catch (error) {
        console.error(error);
        res.redirect("/");
    }
}

//[GET] /products/:slug
module.exports.detail = async(req, res) => {
    try {
        const slug = req.params.slug
        const product = await Product.findOne({
            slug: slug,
            deleted: false,
            status: "active"
        })
        if(!product) {
            return res.redirect("/products")
        }
        product.priceNew = Math.round((product.price * (100 - product.discountPercentage) / 100).toFixed(0))

        let colorways = [];
        if (product.styleCode) {
            colorways = await Product.find({
                styleCode: product.styleCode,
                status: "active",
                deleted: false
            }).select("slug thumbnail color"); 
        }

        let totalStock = 0;
        if (product.variants) {
            totalStock = product.variants.reduce((sum, item) => sum + item.stock, 0);
        }
        
        res.render("client/pages/products/detail.pug", {
            pageTitle: product.title,
            product: product,
            colorways: colorways,
            totalStock: totalStock
        })
    } catch(error) {
        res.redirect("/products")
    }
}

