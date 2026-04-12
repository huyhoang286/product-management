// HIỂN THỊ TOAST THÔNG BÁO TỪ SESSION STORAGE
const successMessage = sessionStorage.getItem("successMessage");
if (successMessage) {
    Swal.fire({ toast: true, position: "top-end", icon: "success", title: successMessage, showConfirmButton: false, timer: 2000 });
    sessionStorage.removeItem("successMessage");
}
const errorMessage = sessionStorage.getItem("errorMessage");
if (errorMessage) {
    Swal.fire({ toast: true, position: "top-end", icon: "error", title: errorMessage, showConfirmButton: false, timer: 2000 });
    sessionStorage.removeItem("errorMessage");
}

// Add Cart
const formAddToCart = document.querySelector("[form-add-to-cart]");
if (formAddToCart) {
    formAddToCart.addEventListener("submit", (e) => {
        e.preventDefault(); 
        const productId = formAddToCart.getAttribute("data-id");
        const quantity = formAddToCart.querySelector("input[name='quantity']").value;
        const variantId = formAddToCart.querySelector("select[name='variant_id']").value;

        fetch(`/cart/add/${productId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ quantity: parseInt(quantity), variant_id: variantId })
        })
        .then(res => res.json())
        .then(data => {
            if (data.code === 200) {
                sessionStorage.setItem("successMessage", data.message);
                window.location.reload(); 
            } else {
                Swal.fire({ toast: true, position: 'top-end', icon: 'error', title: data.message, showConfirmButton: false, timer: 2000 });
            }
        });
    });
}
// End Add Cart

// Update Cart
const inputsQuantity = document.querySelectorAll("input[name='quantity'][product-id]");
if (inputsQuantity.length > 0) {
    inputsQuantity.forEach(input => {
        input.addEventListener("change", (e) => {
            const productId = input.getAttribute("product-id");
            const variantId = input.getAttribute("variant-id");
            const quantity = input.value;

            if(quantity > 0) {
                fetch(`/cart/update/${productId}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ quantity: parseInt(quantity), variant_id: variantId })
                })
                .then(res => res.json())
                .then(data => {
                    if (data.code === 200) {
                        sessionStorage.setItem("successMessage", data.message);
                        window.location.reload(); 
                    } else {
                        Swal.fire({ toast: true, position: 'top-end', icon: 'error', title: data.message, showConfirmButton: false, timer: 2000 });
                    }
                });
            }
        });
    });
}
// End Update Cart

//Delete Cart
const buttonsDeleteCart = document.querySelectorAll("[button-delete-cart]");
if (buttonsDeleteCart.length > 0) {
    buttonsDeleteCart.forEach(button => {
        button.addEventListener("click", () => {
            const productId = button.getAttribute("product-id");
            const variantId = button.getAttribute("variant-id");

            Swal.fire({
                title: 'Bạn có chắc chắn muốn xóa?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Đúng, xóa đi!',
                cancelButtonText: 'Hủy'
            }).then((result) => {
                if (result.isConfirmed) {
                    fetch(`/cart/delete/${productId}`, {
                        method: "DELETE",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ variant_id: variantId })
                    })
                    .then(res => res.json())
                    .then(data => {
                        if (data.code === 200) {
                            sessionStorage.setItem("successMessage", data.message);
                            window.location.reload();
                        } else {
                            Swal.fire({ toast: true, position: 'top-end', icon: 'error', title: data.message, showConfirmButton: false, timer: 2000 });
                        }
                    });
                }
            });
        });
    });
}
// End Delete Cart

// Checkout
const formCheckout = document.querySelector("[form-checkout]");
if (formCheckout) {
    formCheckout.addEventListener("submit", (e) => {
        e.preventDefault();

        const formData = new FormData(formCheckout);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });

        fetch("/checkout/order", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(data => {
            if (data.code === 200) {
                if (data.data.paymentUrl) {
                    window.location.href = data.data.paymentUrl;
                } else {
                    window.location.href = `/checkout/success/${data.data.orderId}`;
                }
            } else {
                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'error',
                    title: data.message,
                    showConfirmButton: false,
                    timer: 3000
                });
            }
        })
        .catch(error => {
            console.error("Lỗi Fetch Checkout:", error);
        });
    });
}
// End Checkout

// register
const formRegister = document.querySelector("[form-register]");
if (formRegister) {
    formRegister.addEventListener("submit", (e) => {
        e.preventDefault();
        const fullName = formRegister.fullName.value;
        const email = formRegister.email.value;
        const phone = formRegister.phone.value;
        const password = formRegister.password.value;
        const confirmPassword = formRegister.confirmPassword.value;

        // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
        if (!emailRegex.test(email)) {
            return Swal.fire({ icon: 'error', title: 'Lỗi!', text: 'Email không đúng định dạng (Ví dụ: abc@gmail.com)!' });
        }

        const phoneRegex = /^(0|\+84)[3|5|7|8|9][0-9]{8}$/;
        if (!phoneRegex.test(phone)) {
            return Swal.fire({ icon: 'error', title: 'Lỗi!', text: 'Số điện thoại không hợp lệ!' });
        }

        if (password !== confirmPassword) {
            return Swal.fire({ icon: 'error', title: 'Lỗi!', text: 'Mật khẩu xác nhận không khớp!' });
        }

        const data = { fullName, email, phone, password };
        
        Swal.fire({
            title: 'Đang xử lý...',
            text: 'Vui lòng chờ hệ thống tạo tài khoản và gửi mã OTP.',
            allowOutsideClick: false,
            didOpen: () => { Swal.showLoading() }
        });

        fetch("/user/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(resData => {
            if (resData.code === 200) {
                sessionStorage.setItem("successMessage", resData.message);
                window.location.href = `/user/otp?email=${resData.email}`;
            } else {
                Swal.fire({ icon: 'error', title: 'Lỗi!', text: resData.message });
            }
        });
    });
}
// End register

// OTP
const formOtp = document.querySelector("[form-otp]");
if (formOtp) {
    formOtp.addEventListener("submit", (e) => {
        e.preventDefault();
        const data = {
            email: formOtp.email.value,
            otp: formOtp.otp.value
        };

        fetch("/user/otp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(resData => {
            if (resData.code === 200) {
                sessionStorage.setItem("successMessage", resData.message);
                window.location.href = "/";
            } else {
                Swal.fire({ toast: true, position: 'top-end', icon: 'error', title: resData.message, showConfirmButton: false, timer: 3000 });
            }
        });
    });
}
// End OTP


// Login
const formLogin = document.querySelector("[form-login]");
if (formLogin) {
    formLogin.addEventListener("submit", (e) => {
        e.preventDefault();
        const data = {
            email: formLogin.email.value,
            password: formLogin.password.value
        };

        fetch("/user/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(resData => {
            if (resData.code === 200) {
                sessionStorage.setItem("successMessage", resData.message);
                window.location.href = "/"; 
            } else {
                Swal.fire({ toast: true, position: 'top-end', icon: 'error', title: resData.message, showConfirmButton: false, timer: 3000 });
            }
        });
    });
}
// End Login

// Update Info
const formUpdateInfo = document.querySelector("[form-update-info]");
if (formUpdateInfo) {
    formUpdateInfo.addEventListener("submit", (e) => {
        e.preventDefault();
        const data = {
            fullName: formUpdateInfo.fullName.value,
            phone: formUpdateInfo.phone.value,
            address: formUpdateInfo.address.value
        };

        fetch("/user/update", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(resData => {
            if (resData.code === 200) {
                sessionStorage.setItem("successMessage", resData.message);
                window.location.reload(); 
            } else {
                Swal.fire({ icon: 'error', title: 'Lỗi!', text: resData.message });
            }
        });
    });
}
// End Update Info

// ĐỔI MẬT KHẨU 
const formChangePassword = document.querySelector("[form-change-password]");
if (formChangePassword) {
    formChangePassword.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const oldPassword = formChangePassword.oldPassword.value;
        const newPassword = formChangePassword.newPassword.value;
        const confirmNewPassword = formChangePassword.confirmNewPassword.value;

        if (newPassword !== confirmNewPassword) {
            return Swal.fire({ icon: 'error', title: 'Lỗi!', text: 'Mật khẩu xác nhận không khớp!' });
        }

        if (oldPassword === newPassword) {
            return Swal.fire({ icon: 'error', title: 'Lỗi!', text: 'Mật khẩu mới không được giống mật khẩu hiện tại!' });
        }

        const data = { oldPassword, newPassword };

        fetch("/user/password/change", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(resData => {
            if (resData.code === 200) {
                Swal.fire({ icon: 'success', title: 'Thành công!', text: resData.message }).then(() => {
                    formChangePassword.reset(); 
                });
            } else {
                Swal.fire({ icon: 'error', title: 'Lỗi!', text: resData.message });
            }
        });
    });
}

// QUÊN MẬT KHẨU (Gửi Email)
const formForgotPassword = document.querySelector("[form-forgot-password]");
if (formForgotPassword) {
    formForgotPassword.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = formForgotPassword.email.value;
        // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;;
        if (!emailRegex.test(email)) {
            return Swal.fire({ icon: 'error', title: 'Lỗi!', text: 'Email không đúng định dạng!' });
        }
        
        Swal.fire({
            title: 'Đang xử lý...',
            text: 'Vui lòng chờ hệ thống gửi mã xác nhận.',
            allowOutsideClick: false,
            didOpen: () => { Swal.showLoading() }
        });

        fetch("/user/password/forgot", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: formForgotPassword.email.value })
        })
        .then(res => res.json())
        .then(resData => {
            if (resData.code === 200) {
                window.location.href = `/user/password/otp?email=${resData.email}`;
            } else {
                Swal.fire({ icon: 'error', title: 'Lỗi!', text: resData.message });
            }
        });
    });
}

// QUÊN MẬT KHẨU (Xác nhận OTP)
const formOtpPassword = document.querySelector("[form-otp-password]");
if (formOtpPassword) {
    formOtpPassword.addEventListener("submit", (e) => {
        e.preventDefault();
        const data = {
            email: formOtpPassword.email.value,
            otp: formOtpPassword.otp.value
        };

        fetch("/user/password/otp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(resData => {
            if (resData.code === 200) {
                window.location.href = `/user/password/reset?email=${resData.email}`;
            } else {
                Swal.fire({ toast: true, position: 'top-end', icon: 'error', title: resData.message, showConfirmButton: false, timer: 3000 });
            }
        });
    });
}

// QUÊN MẬT KHẨU (Đặt mật khẩu mới)
const formResetPassword = document.querySelector("[form-reset-password]");
if (formResetPassword) {
    formResetPassword.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = formResetPassword.email.value;
        const password = formResetPassword.password.value;
        const confirmPassword = formResetPassword.confirmPassword.value;

        if (password !== confirmPassword) {
            return Swal.fire({ icon: 'error', title: 'Lỗi!', text: 'Mật khẩu xác nhận không khớp!' });
        }

        const data = { email, password };

        fetch("/user/password/reset", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(resData => {
            if (resData.code === 200) {
                sessionStorage.setItem("successMessage", resData.message);
                window.location.href = "/user/login"; 
            } else {
                Swal.fire({ icon: 'error', title: 'Lỗi!', text: resData.message });
            }
        });
    });
}

// TÍNH NĂNG BỘ LỌC VÀ SẮP XẾP SẢN PHẨM
const url = new URL(window.location.href);

// Lọc theo giá (Radio buttons)
const radioPrices = document.querySelectorAll("[filter-price]");
if (radioPrices.length > 0) {
    radioPrices.forEach(radio => {
        radio.addEventListener("change", (e) => {
            const value = e.target.value;
            if (value) {
                url.searchParams.set("price", value);
            } else {
                url.searchParams.delete("price"); 
            }
            window.location.href = url.href; 
        });
    });
}

// Sắp xếp (Select box)
const selectSort = document.querySelector("[sort-select]");
if (selectSort) {
    selectSort.addEventListener("change", (e) => {
        const value = e.target.value;
        if (value && value !== "newest") {
            url.searchParams.set("sort", value);
        } else {
            url.searchParams.delete("sort"); 
        }
        window.location.href = url.href;
    });
}