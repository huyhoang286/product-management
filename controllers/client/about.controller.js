// [GET] /about
module.exports.index = async (req, res) => {
  res.render("client/pages/about/index", {
    pageTitle: "Giới thiệu về SHOP ABC",
    path: "/about"
  });
};