// Xử lý logic sản phẩm

// Change Status
const buttonsChangeStatusProduct = document.querySelectorAll("[button-change-status]")
if(buttonsChangeStatusProduct.length > 0) {
    buttonsChangeStatusProduct.forEach(button => {
        button.addEventListener("click", () => {
            const statusCurrent = button.getAttribute("data-status")
            const id = button.getAttribute("data-id")
            let statusChange = statusCurrent == "active" ? "inactive" : "active"

            const path = `/admin/products/change-status/${statusChange}/${id}`
            fetch(path, {
                method: "PATCH"
            })
            .then(res => res.json())
            .then(data => {
                if(data.code == 200) {
                    button.setAttribute("data-status", statusChange);
                    if(statusChange == "active") {
                        button.classList.remove("badge-danger");
                        button.classList.add("badge-success");
                        button.innerHTML = "Hoạt động";
                    } else {
                        button.classList.remove("badge-success");
                        button.classList.add("badge-danger");
                        button.innerHTML = "Dừng hoạt động";
                    }
                    Swal.fire({
                        toast: true,
                        position: "top-end", 
                        icon: "success",    
                        title: data.message, 
                        showConfirmButton: false,
                        timer: 2000        
                    })
                }
            })
            .catch(error => console.error('Error:', error))
        })
    })
}
// End Change Status

// Delete Item
const buttonsDeleteProduct = document.querySelectorAll("[button-delete]")
if(buttonsDeleteProduct) {
    buttonsDeleteProduct.forEach(button => {
        button.addEventListener("click", () => {
            const id = button.getAttribute("data-id")
            Swal.fire({
                title: "Bạn có chắc chắn muốn xóa?",
                text: "Hành động này sẽ xóa sản phẩm vĩnh viễn!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6",
                confirmButtonText: "Đồng ý",
                cancelButtonText: "Hủy"
            }).then((result) => {
                if(result.isConfirmed){
                    const path = `/admin/products/delete/${id}`
                    fetch(path, {
                        method: "DELETE"
                    })
                    .then(res => res.json())
                    .then(data => {
                        const tr = button.closest("tr")
                        tr.remove()

                        Swal.fire({
                            toast: true,
                            position: "top-end",
                            icon: "success",
                            title: data.message,
                            showConfirmButton: false,
                            timer: 2000
                        })
                    })
                }
                    
            })
        })
    })
}
// End Delete Item

// Restore Item
const buttonsRestore = document.querySelectorAll("[button-restore]")
if(buttonsRestore) {
    buttonsRestore.forEach(button => {
        button.addEventListener("click", () => {
            const id = button.getAttribute("data-id")
            const path = `/admin/products/restore/${id}`
            fetch(path, {
                method: "PATCH"
            })
            .then(res => res.json())
            .then(data => {
                if(data.code == 200) {
                    const tr = button.closest("tr")
                    tr.remove()

                    Swal.fire({
                        toast: true,
                        position: "top-end",
                        icon: "success",
                        title: data.message,
                        showConfirmButton: false,
                        timer: 2000
                    });
                }
            })
        })
    })
}
// End Restore Item

// Create Item
const  formCreateProduct = document.querySelector("#form-create-product")
if(formCreateProduct) {
    formCreateProduct.addEventListener("submit",(e) => {
        e.preventDefault()
        const formData = new FormData(formCreateProduct)
        fetch("/admin/products/create", {
            method: "POST",
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            if(data.code == 200) {
                sessionStorage.setItem("successMessage", data.message);
                window.location.href = "/admin/products";
            } else {
                Swal.fire({
                    toast: true,
                    position: "top-end",
                    icon: "error",
                    title: data.message,
                    showConfirmButton: false,
                    timer: 3000
                });
            }
        })
        .catch(error => {
            console.log("Lỗi:", error)
        })
    })
}
// End Create Item

// Add/Remove Variants
const buttonAddVariant = document.querySelector("#button-add-variant");
const variantsContainer = document.querySelector("#variants-container");
if (buttonAddVariant && variantsContainer) {
    // Thêm dòng mới
    buttonAddVariant.addEventListener("click", () => {
        const newVariant = document.createElement("div");
        newVariant.classList.add("row", "mb-2", "variant-item");
        newVariant.innerHTML = `
            <div class="col-5">
                <input class="form-control" type="text" name="sizes" placeholder="Kích cỡ (VD: 40)" required>
            </div>
            <div class="col-5">
                <input class="form-control" type="number" name="stocks" placeholder="Số lượng" min="0" required>
            </div>
            <div class="col-2">
                <button class="btn btn-danger w-100" type="button" button-remove-variant>Xóa</button>
            </div>
        `;
        variantsContainer.appendChild(newVariant);
    });
    // Xóa dòng
    variantsContainer.addEventListener("click", (e) => {
        if (e.target.hasAttribute("button-remove-variant")) {
            const variantItem = e.target.closest(".variant-item");
            if (variantsContainer.querySelectorAll(".variant-item").length > 1) {
                variantItem.remove();
            } else {
                Swal.fire('Cảnh báo', 'Sản phẩm phải có ít nhất 1 kích cỡ!', 'warning');
            }
        }
    });
}
// End Add/Remove Variants

// Edit Item
const formEditProduct = document.querySelector("#form-edit-product")
if(formEditProduct) {
    formEditProduct.addEventListener("submit", (e) => {
        e.preventDefault()
        const id = formEditProduct.getAttribute("data-id")

        const formData = new FormData(formEditProduct)
        const path = `/admin/products/edit/${id}`
        fetch(path, {
            method: "PATCH",
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            if(data.code == 200) {
                sessionStorage.setItem("successMessage", data.message)
                window.location.href = "/admin/products"
            }
            else {
                Swal.fire({
                    toast: true,
                    position: "top-end",
                    icon: "error",
                    title: data.message,
                    showConfirmButton: false,
                    timer: 3000
                })
            }
        })
        .catch(error => {
            console.log("Lỗi", error)
        })
    })
}
// End Edit Item