const User = require("../../models/user.model");
const Otp = require("../../models/otp.model");
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
        const { fullName, email, password } = req.body;

        const existEmail = await User.findOne({ email: email, deleted: false });
        if (existEmail) {
            return res.json({ code: 400, message: "Email đã tồn tại trong hệ thống!" });
        }

        const user = new User({
            fullName: fullName,
            email: email,
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