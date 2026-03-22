module.exports.createPost = async(req, res, next) => {
   if(!req.body.title) {
        res.json({ code: 400, message: "Vui lòng nhập tiêu đề!" })
        return
   }
   if(req.body.title.length < 5) {
        res.json({ code: 400, message: "Tiêu đề phải dài ít nhất 5 ký tự!" })
        return
   }
   next()
}