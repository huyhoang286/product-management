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
                window.location.href = `/checkout/success/${resData.orderId}`;
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