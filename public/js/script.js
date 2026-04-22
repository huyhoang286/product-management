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
        .then(resData => {
            if (resData.code === 200) {
                sessionStorage.setItem("successMessage", resData.message);
                
                if (resData.data && resData.data.paymentUrl) {
                    window.location.href = resData.data.paymentUrl;
                } 
                else if (resData.data && resData.data.orderId) {
                    window.location.href = `/checkout/success/${resData.data.orderId}`;
                }
            } else {
                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'error',
                    title: resData.message,
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

// Buy now 
const buttonBuyNow = document.querySelector("[button-buy-now]");
if (buttonBuyNow) {
    buttonBuyNow.addEventListener("click", () => {
        const formAddToCart = buttonBuyNow.closest("[form-add-to-cart]");
        const productId = formAddToCart.getAttribute("data-id");
        const quantity = formAddToCart.querySelector("input[name='quantity']").value;
        const variantId = formAddToCart.querySelector("select[name='variant_id']").value;

        if (!variantId) {
            Swal.fire({ toast: true, position: 'top-end', icon: 'warning', title: 'Vui lòng chọn kích cỡ!', showConfirmButton: false, timer: 2000 });
            return;
        }

        fetch(`/cart/add/${productId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ quantity: parseInt(quantity), variant_id: variantId })
        })
        .then(res => res.json())
        .then(data => {
            if (data.code === 200) {
                const itemsToCheckout = [{
                    productId: productId,
                    variantId: variantId
                }];

                const encodedItems = encodeURIComponent(JSON.stringify(itemsToCheckout));
                
                window.location.href = `/checkout?items=${encodedItems}`; 

            } else {
                Swal.fire({ toast: true, position: 'top-end', icon: 'error', title: data.message, showConfirmButton: false, timer: 2000 });
            }
        });
    });
}
// End Buy now

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

// Xử lý checkbox và xóa nhiều sản phẩm trong giỏ hàng
const checkAll = document.querySelector("input[name='checkAll']");
const checkItems = document.querySelectorAll("input[name='checkItem']");
const totalPriceEl = document.querySelector("#total-price");
const btnDeleteMultiple = document.querySelector("[button-delete-multiple]");
const btnCheckout = document.querySelector("[button-checkout]");

// Hàm tính toán tổng tiền các mục được check
const calculateTotal = () => {
    let total = 0;
    let checkedCount = 0;
    checkItems.forEach(item => {
        if(item.checked) {
            total += parseInt(item.getAttribute("data-price"));
            checkedCount++;
        }
    });
    totalPriceEl.innerHTML = total.toLocaleString("vi-VN") + " VNĐ";
    
    // Hiện/ẩn nút xóa nhiều
    if(checkedCount > 0) btnDeleteMultiple.classList.remove("d-none");
    else btnDeleteMultiple.classList.add("d-none");
}
// Bắt sự kiện Check All
if(checkAll) {
    checkAll.addEventListener("change", () => {
        checkItems.forEach(item => item.checked = checkAll.checked);
        calculateTotal();
    });
}
// Bắt sự kiện Check từng Item
checkItems.forEach(item => {
    item.addEventListener("change", () => {
        const totalChecked = document.querySelectorAll("input[name='checkItem']:checked").length;
        checkAll.checked = totalChecked === checkItems.length;
        calculateTotal();
    });
});
// Xử lý XÓA NHIỀU SẢN PHẨM
if(btnDeleteMultiple) {
    btnDeleteMultiple.addEventListener("click", () => {
        Swal.fire({
            title: 'Bạn chắc chắn muốn xóa?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy'
        }).then((result) => {
            if (result.isConfirmed) {
                const checkedInputs = document.querySelectorAll("input[name='checkItem']:checked");
                const itemsToDelete = Array.from(checkedInputs).map(input => ({
                    product_id: input.getAttribute("product-id"),
                    variant_id: input.getAttribute("variant-id")
                }));

                fetch('/cart/delete-multiple', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ items: itemsToDelete })
                })
                .then(res => res.json())
                .then(data => {
                    if(data.code === 200) window.location.reload();
                });
            }
        });
    });
}
// Xử lý nút thanh toán trong giỏ hàng
if(btnCheckout) {
    btnCheckout.addEventListener("click", () => {
        const checkedInputs = document.querySelectorAll("input[name='checkItem']:checked");
        if(checkedInputs.length === 0) {
            Swal.fire("Thông báo", "Vui lòng chọn ít nhất 1 sản phẩm để thanh toán!", "warning");
            return;
        }

        const itemsToCheckout = Array.from(checkedInputs).map(input => ({
            productId: input.getAttribute("product-id"),
            variantId: input.getAttribute("variant-id")
        }));

        const encodedItems = encodeURIComponent(JSON.stringify(itemsToCheckout));
        window.location.href = `/checkout?items=${encodedItems}`;
    });
}

// Pagination
const buttonsPagination = document.querySelectorAll("[button-pagination]");
if (buttonsPagination.length > 0) {
    let url = new URL(window.location.href);

    buttonsPagination.forEach(button => {
        button.addEventListener("click", () => {
            const page = button.getAttribute("button-pagination");
            
            url.searchParams.set("page", page);
            window.location.href = url.href;
        });
    });
}
// End Pagination

// CHỨC NĂNG LƯU MÃ GIẢM GIÁ
const buttonsSaveVoucher = document.querySelectorAll(".btn-save-voucher");
if (buttonsSaveVoucher.length > 0) {
    buttonsSaveVoucher.forEach(button => {
        button.addEventListener("click", () => {
            const id = button.getAttribute("data-id");

            fetch(`/user/vouchers/save/${id}`, { method: "POST" })
                .then(res => res.json())
                .then(data => {
                    if (data.code === 200) {
                        // Đổi trạng thái nút
                        button.innerHTML = "Đã lưu ✓";
                        button.classList.add("btn-secondary"); 
                        button.setAttribute("disabled", "true"); 

                        Swal.fire({
                            toast: true,
                            position: "top-end",
                            icon: "success",
                            title: data.message,
                            showConfirmButton: false,
                            timer: 2000
                        });
                    } else if (data.code === 401) {
                        // Yêu cầu đăng nhập
                        Swal.fire({
                            icon: "warning",
                            title: "Chưa đăng nhập",
                            text: data.message,
                            showCancelButton: true,
                            confirmButtonText: "Đăng nhập ngay",
                            cancelButtonText: "Hủy"
                        }).then((result) => {
                            if (result.isConfirmed) {
                                window.location.href = "/user/login";
                            }
                        });
                    } else {
                        Swal.fire({ icon: "error", title: data.message });
                    }
                });
        });
    });
}
// End CHỨC NĂNG LƯU MÃ GIẢM GIÁ


// Xử lý tính toán khi chọn Voucher ở trang Thanh toán
const voucherSelect = document.querySelector("#voucherSelect");
if (voucherSelect) {
  voucherSelect.addEventListener("change", (e) => {
    const subTotalElement = document.querySelector("#subTotal");
    const subTotal = parseInt(subTotalElement.getAttribute("data-subtotal")); // Lấy giá Tạm tính
    
    const selectedOption = voucherSelect.options[voucherSelect.selectedIndex];
    
    if (!selectedOption.value) {
      document.querySelector("#discountAmount").innerHTML = "0 VNĐ";
      document.querySelector("#finalTotal").innerHTML = `${subTotal.toLocaleString("vi-VN")}`;
      return;
    }

    const discountPercent = parseInt(selectedOption.getAttribute("data-discount"));
    const discountAmount = Math.round((subTotal * discountPercent) / 100);
    const finalTotal = subTotal - discountAmount;

    document.querySelector("#discountAmount").innerHTML = `-${discountAmount.toLocaleString("vi-VN")} VNĐ`;
    document.querySelector("#finalTotal").innerHTML = `${finalTotal.toLocaleString("vi-VN")}`;
  });
}
// End Xử lý tính toán khi chọn Voucher ở trang Thanh toán