const User = require("../../models/user.model");
const Otp = require("../../models/otp.model");
const Order = require("../../models/order.model"); 
const Product = require("../../models/product.model");
const md5 = require("md5");
const nodemailer = require("nodemailer");

// Hàm tạo chuỗi ngẫu nhiên (dùng để tạo tokenUser sau khi đăng nhập thành công)
const generateRandomString = (length) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
};

// Hàm tạo OTP 6 số
const generateRandomNumber = (length) => {
    const characters = '0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
};

// Hàm gửi email qua Gmail
const sendEmail = (email, subject, html) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: subject,
        html: html
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) console.log(error);
        else console.log('Email sent: ' + info.response);
    });
};


// [GET] /user/register
module.exports.register = async (req, res) => {
    res.render("client/pages/user/register", {
        pageTitle: "Đăng ký tài khoản"
    });
};

// [POST] /user/register
module.exports.registerPost = async (req, res) => {
    try {
        const { fullName, email, password, phone } = req.body;

        const existEmail = await User.findOne({ email: email, deleted: false });
        if (existEmail) {
            return res.json({ code: 400, message: "Email đã tồn tại trong hệ thống!" });
        }

        const user = new User({
            fullName: fullName,
            email: email,
            phone: phone,
            password: md5(password),
            status: "inactive"
        });
        await user.save();

        const otp = generateRandomNumber(6);
        const objectOtp = { email: email, otp: otp };
        const otpRecord = new Otp(objectOtp);
        await otpRecord.save();

        const subject = "Mã xác thực OTP đăng ký tài khoản";
        const html = `Xin chào <b>${fullName}</b>,<br>Mã xác thực OTP của bạn là: <h2 style="color: blue;">${otp}</h2><br>Mã này sẽ tự động hết hạn sau 3 phút.`;
        sendEmail(email, subject, html);

        res.json({ 
            code: 200, 
            message: "Vui lòng kiểm tra email để lấy mã OTP!",
            email: email 
        });
    } catch (error) {
        res.json({ code: 500, message: "Lỗi hệ thống!" });
    }
};

// [GET] /user/otp
module.exports.otp = async (req, res) => {
    const email = req.query.email;
    res.render("client/pages/user/otp", {
        pageTitle: "Nhập mã OTP",
        email: email
    });
};

// [POST] /user/otp
module.exports.otpPost = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const result = await Otp.findOne({ email: email, otp: otp });
        if (!result) {
            return res.json({ code: 400, message: "Mã OTP không hợp lệ hoặc đã hết hạn!" });
        }

        const tokenUser = generateRandomString(30);
        await User.updateOne({ email: email }, {
            status: "active",
            tokenUser: tokenUser
        });

        res.cookie("tokenUser", tokenUser);

        res.json({ code: 200, message: "Xác thực thành công! Đã đăng nhập." });
    } catch (error) {
        res.json({ code: 500, message: "Lỗi hệ thống!" });
    }
};

// [GET] /user/login
module.exports.login = async (req, res) => {
    res.render("client/pages/user/login", {
        pageTitle: "Đăng nhập tài khoản"
    });
};

// [POST] /user/login
module.exports.loginPost = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email: email, deleted: false });
        if (!user) {
            return res.json({ code: 400, message: "Email không tồn tại trong hệ thống!" });
        }

        if (md5(password) !== user.password) {
            return res.json({ code: 400, message: "Mật khẩu không chính xác!" });
        }

        if (user.status === "inactive") {
            return res.json({ code: 400, message: "Tài khoản chưa được kích hoạt. Vui lòng kiểm tra email!" });
        }

        res.cookie("tokenUser", user.tokenUser);

        res.json({ code: 200, message: "Đăng nhập thành công!" });
    } catch (error) {
        res.json({ code: 500, message: "Lỗi hệ thống!" });
    }
};

// [GET] /user/logout
module.exports.logout = async (req, res) => {
    res.clearCookie("tokenUser"); // Xóa cookie
    res.redirect("/"); // Trở về trang chủ
};

// [GET] /user/info
module.exports.info = async (req, res) => {
    if (!res.locals.user) {
        return res.redirect("/user/login");
    }

    res.render("client/pages/user/info", {
        pageTitle: "Thông tin tài khoản"
    });
};

// [PATCH] /user/update
module.exports.updatePatch = async (req, res) => {
    try {
        if (!req.cookies.tokenUser) return res.json({ code: 400, message: "Vui lòng đăng nhập!" });

        const { fullName, phone, address } = req.body;

        await User.updateOne(
            { tokenUser: req.cookies.tokenUser },
            {
                fullName: fullName,
                phone: phone,
                address: address
            }
        );

        res.json({ code: 200, message: "Cập nhật thông tin thành công!" });
    } catch (error) {
        res.json({ code: 500, message: "Lỗi hệ thống!" });
    }
};

// [PATCH] /user/password/change
module.exports.changePasswordPatch = async (req, res) => {
    try {
        if (!req.cookies.tokenUser) return res.json({ code: 400, message: "Vui lòng đăng nhập!" });

        const { oldPassword, newPassword } = req.body;
        const tokenUser = req.cookies.tokenUser;

        const user = await User.findOne({ tokenUser: tokenUser, deleted: false });
        if (!user) {
            return res.json({ code: 400, message: "Tài khoản không tồn tại!" });
        }

        if (md5(oldPassword) !== user.password) {
            return res.json({ code: 400, message: "Mật khẩu hiện tại không chính xác!" });
        }

        await User.updateOne(
            { tokenUser: tokenUser },
            { password: md5(newPassword) }
        );

        res.json({ code: 200, message: "Đổi mật khẩu thành công!" });
    } catch (error) {
        res.json({ code: 500, message: "Lỗi hệ thống!" });
    }
};

//--------Quên mật khẩu
// [GET] /user/password/forgot
module.exports.forgotPassword = async (req, res) => {
    res.render("client/pages/user/forgot-password", {
        pageTitle: "Lấy lại mật khẩu"
    });
};

// [POST] /user/password/forgot
module.exports.forgotPasswordPost = async (req, res) => {
    try {
        const email = req.body.email;
        const user = await User.findOne({ email: email, deleted: false });

        if (!user) {
            return res.json({ code: 400, message: "Email không tồn tại trong hệ thống!" });
        }

        // Tạo mã OTP và lưu vào DB
        const otp = generateRandomNumber(6);
        const objectOtp = { email: email, otp: otp };
        const otpRecord = new Otp(objectOtp);
        await otpRecord.save();

        // Gửi email
        const subject = "Mã xác thực OTP lấy lại mật khẩu";
        const html = `Xin chào <b>${user.fullName}</b>,<br>Mã xác thực lấy lại mật khẩu của bạn là: <h2 style="color: green;">${otp}</h2><br>Mã này sẽ tự động hết hạn sau 3 phút.`;
        sendEmail(email, subject, html);

        res.json({ code: 200, message: "Đã gửi mã OTP đến email của bạn!", email: email });
    } catch (error) {
        res.json({ code: 500, message: "Lỗi hệ thống!" });
    }
};

// [GET] /user/password/otp
module.exports.otpPassword = async (req, res) => {
    const email = req.query.email;
    res.render("client/pages/user/otp-password", {
        pageTitle: "Xác thực OTP",
        email: email
    });
};

// Xử lý Xác thực OTP
// [POST] /user/password/otp
module.exports.otpPasswordPost = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const result = await Otp.findOne({ email: email, otp: otp });

        if (!result) {
            return res.json({ code: 400, message: "Mã OTP không hợp lệ hoặc đã hết hạn!" });
        }

        res.json({ code: 200, message: "Xác thực thành công!", email: email });
    } catch (error) {
        res.json({ code: 500, message: "Lỗi hệ thống!" });
    }
};

// [GET] /user/password/reset
module.exports.resetPassword = async (req, res) => {
    const email = req.query.email;
    res.render("client/pages/user/reset-password", {
        pageTitle: "Đổi mật khẩu mới",
        email: email
    });
};

// Xử lý Lưu mật khẩu mới
// [POST] /user/password/reset
module.exports.resetPasswordPost = async (req, res) => {
    try {
        const { email, password } = req.body;

        await User.updateOne(
            { email: email },
            { password: md5(password) } 
        );

        res.json({ code: 200, message: "Đổi mật khẩu thành công! Vui lòng đăng nhập lại." });
    } catch (error) {
        res.json({ code: 500, message: "Lỗi hệ thống!" });
    }
};
//------End Quên mật khẩu

// [GET] /user/orders
module.exports.orders = async (req, res) => {
    try {
        if (!res.locals.user) return res.redirect("/user/login");

        const orders = await Order.find({ 
            user_id: res.locals.user.id
        }).sort({ createdAt: "desc" });

        for (const order of orders) {
            let totalPrice = 0;
            for (const item of order.products) {
                const productInfo = await Product.findOne({ _id: item.product_id }).select("title thumbnail slug");
                item.productInfo = productInfo;
                
                item.priceNew = Math.round(item.price * (1 - item.discountPercentage / 100));
                item.totalPrice = item.priceNew * item.quantity;
                totalPrice += item.totalPrice;
            }
            order.totalPrice = totalPrice;
        }
        // console.log(orders);

        res.render("client/pages/user/orders", {
            pageTitle: "Lịch sử đơn hàng",
            orders: orders
        });
    } catch (error) {
        console.log("Lỗi lấy lịch sử đơn hàng:", error);
        res.redirect("back");
    }
};

// [GET] /user/auth/google/callback
module.exports.googleLoginCallback = async (req, res) => {
  const user = req.user;
  
  res.cookie("tokenUser", user.tokenUser, {
    expires: new Date(Date.now() + 900000 * 24), 
    httpOnly: true
  });

  res.redirect("/");
};