const ProductCategory = require("../../models/product-category.model");
const Product = require("../../models/product.model");
const paginationHelper = require("../../helpers/pagination");

//[GET] /products
module.exports.index = async (req, res) => {
    try {
        const matchConditions = {
            status: "active",
            deleted: false
        };

        // LỌC THEO TỪ KHÓA TÌM KIẾM
        const keyword = req.query.keyword;
        if (keyword) {
            matchConditions.title = new RegExp(keyword, "i"); 
        }

        // LỌC THEO DANH MỤC ĐA CẤP 
        const categorySlug = req.query.category;
        let categoryTitle = ""; 

        if (categorySlug) {
            const category = await ProductCategory.findOne({ slug: categorySlug, status: "active", deleted: false });

            if (category) {
                categoryTitle = category.title;

                const getSubCategory = async (parentId) => {
                    const subs = await ProductCategory.find({
                        parent_id: parentId,
                        status: "active",
                        deleted: false
                    });

                    let allSub = [...subs];

                    for (const sub of subs) {
                        const childs = await getSubCategory(sub.id);
                        allSub = allSub.concat(childs);
                    }

                    return allSub;
                };

                const listSubCategory = await getSubCategory(category.id);
                const listSubCategoryId = listSubCategory.map(item => item.id);

                matchConditions.product_category_id = { $in: [category.id, ...listSubCategoryId] };
            }
        }

        const pipeline = [
            { $match: matchConditions },
            {
                $addFields: {
                    newPrice: {
                        $round: [
                            { $multiply: [ "$price", { $divide: [ { $subtract: [100, "$discountPercentage"] }, 100 ] } ] },
                            0
                        ]
                    }
                }
            }
        ];

        // LỌC THEO MỨC GIÁ
        const priceQuery = req.query.price;
        if (priceQuery) {
            if (priceQuery === "under1") pipeline.push({ $match: { newPrice: { $lt: 1000000 } } });
            else if (priceQuery === "1to2") pipeline.push({ $match: { newPrice: { $gte: 1000000, $lte: 2000000 } } });
            else if (priceQuery === "over2") pipeline.push({ $match: { newPrice: { $gt: 2000000 } } });
        }

        // GOM NHÓM 
        pipeline.push({
            $group: {
                _id: { $ifNull: ["$styleCode", "$_id"] },
                doc: { $first: "$$ROOT" } 
            }
        });
        pipeline.push({ $replaceRoot: { newRoot: "$doc" } });

        // SẮP XẾP SẢN PHẨM
        const sortQuery = req.query.sort;
        let sortObject = { createdAt: -1 }; 
        
        if (sortQuery === "price-asc") sortObject = { newPrice: 1 };
        else if (sortQuery === "price-desc") sortObject = { newPrice: -1 };
        else if (sortQuery === "best-selling") sortObject = { sold: -1 }; 
        
        pipeline.push({ $sort: sortObject });

        // XỬ LÝ PHÂN TRANG (PAGINATION)
        const countPipeline = [...pipeline, { $count: "totalCount" }];
        const countResult = await Product.aggregate(countPipeline);
        const totalProducts = countResult.length > 0 ? countResult[0].totalCount : 0;

        //-- Lấy giới hạn sản phẩm 1 trang từ biến settingGeneral 
        const limitItems = (res.locals.settingGeneral && res.locals.settingGeneral.productsPerPage) 
                           ? res.locals.settingGeneral.productsPerPage 
                           : 8;

        //-- Tính toán thông số phân trang thông qua Helper
        let objectPagination = paginationHelper(
            {
                currentPage: 1,
                limitItems: limitItems
            },
            req.query,
            totalProducts
        );

        pipeline.push({ $skip: objectPagination.skip });
        pipeline.push({ $limit: objectPagination.limitItems });

        const products = await Product.aggregate(pipeline);

        let finalTitle = "Tất Cả Sản Phẩm";
        if (keyword) finalTitle = `Kết quả tìm kiếm: "${keyword}"`;
        else if (categoryTitle) finalTitle = `Danh mục: ${categoryTitle}`;

        res.render("client/pages/products/index.pug", {
            pageTitle: finalTitle,
            products: products,
            keyword: keyword,
            price: priceQuery, 
            sort: sortQuery,
            pagination: objectPagination
        });
    } catch (error) {
        console.error("Lỗi Controller Sản phẩm:", error);
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

