// [GET] /contact
module.exports.index = async (req, res) => {
  res.render("client/pages/contact/index", {
    pageTitle: "Liên hệ",
    path: "/contact" 
  });
};
