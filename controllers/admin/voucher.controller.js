const Voucher = require("../../models/voucher.model");
const systemConfig = require("../../config/system");

// [GET] /admin/vouchers
module.exports.index = async (req, res) => {
  const vouchers = await Voucher.find({ deleted: false }).sort({ createdAt: "desc" });
  
  res.render("admin/pages/vouchers/index", {
    pageTitle: "Quản lý mã giảm giá",
    vouchers: vouchers
  });
};

// [GET] /admin/vouchers/create
module.exports.create = (req, res) => {
  res.render("admin/pages/vouchers/create", {
    pageTitle: "Thêm mới mã giảm giá"
  });
};

// [GET] /admin/vouchers/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const voucher = await Voucher.findOne({
      _id: req.params.id,
      deleted: false
    });

    if (!voucher) {
      return res.redirect(`${systemConfig.prefixAdmin}/vouchers`);
    }

    const expireAtFormat = voucher.expireAt.toISOString().split('T')[0];

    res.render("admin/pages/vouchers/edit", {
      pageTitle: "Chỉnh sửa mã giảm giá",
      voucher: voucher,
      expireAtFormat: expireAtFormat
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/vouchers`);
  }
};

// [POST] /admin/vouchers/create
module.exports.createPost = async (req, res) => {
  try {
    const expireDate = new Date(req.body.expireAt);
    if (expireDate < new Date()) {
      return res.json({ code: 400, message: "Ngày hết hạn phải lớn hơn hiện tại!" });
    }
    req.body.code = req.body.code.toUpperCase();
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.minOrderValue = parseInt(req.body.minOrderValue);
    req.body.quantity = parseInt(req.body.quantity);

    const record = new Voucher(req.body);
    await record.save();

    res.json({
      code: 200,
      message: "Tạo mã giảm giá thành công!"
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Tạo thất bại: Mã giảm giá này có thể đã tồn tại!"
    });
  }
};
// [PATCH] /admin/vouchers/change-status/:status/:id 
module.exports.changeStatus = async (req, res) => {
  try {
    const status = req.params.status;
    const id = req.params.id;

    await Voucher.updateOne({ _id: id }, { status: status });

    res.json({
        code: 200,
        message: "Cập nhật trạng thái thành công!"
    });
  } catch (error) {
    res.json({ code: 400, message: "Cập nhật thất bại!" });
  }
};

// [PATCH] /admin/vouchers/edit/:id
module.exports.editPatch = async (req, res) => {
  try {
    const expireDate = new Date(req.body.expireAt);
    if (expireDate < new Date()) {
      return res.json({ code: 400, message: "Ngày hết hạn phải lớn hơn hiện tại!" });
    }
    req.body.code = req.body.code.toUpperCase();
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.minOrderValue = parseInt(req.body.minOrderValue);
    req.body.quantity = parseInt(req.body.quantity);

    await Voucher.updateOne({ _id: req.params.id }, req.body);

    res.json({
      code: 200,
      message: "Cập nhật mã giảm giá thành công!"
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Cập nhật thất bại!"
    });
  }
};

// [DELETE] /admin/vouchers/delete/:id 
module.exports.deleteItem = async (req, res) => {
  try {
    const id = req.params.id;

    await Voucher.updateOne({ _id: id }, { 
        deleted: true,
        deletedAt: new Date()
    });

    res.json({
        code: 200,
        message: "Xóa mã giảm giá thành công!"
    });
  } catch (error) {
    res.json({ code: 400, message: "Xóa thất bại!" });
  }
};