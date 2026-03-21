module.exports.createPost = async(req, res, next) => {
   if(!req.body.title) {
        req.flash("error", "Vui lòng nhập tiêu đề!")
        res.redirect(req.get("Referrer") || "/");
        return
   }
   if(req.body.title.length < 5) {
        req.flash("error", "Tiêu đề phải dài ít nhất 5 ký tự!")
        res.redirect(req.get("Referrer") || "/");
        return
   }
   next()
}