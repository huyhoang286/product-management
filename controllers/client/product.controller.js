const Product = require("../../models/product.model")

//[GET] /products
module.exports.index = async (req, res) => {
    try {
        const matchConditions = {
            status: "active",
            deleted: false
        };

        const keyword = req.query.keyword;
        if (keyword) {
            matchConditions.title = new RegExp(keyword, "i"); 
        }

        const products = await Product.aggregate([
            {
                $match: matchConditions 
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
            pageTitle: keyword ? `Kết quả tìm kiếm: ${keyword}` : "Danh sách sản phẩm",
            products: products,
            keyword: keyword 
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

