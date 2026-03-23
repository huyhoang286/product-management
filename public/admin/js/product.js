// Xử lý logic sản phẩm

// Change Status
const buttonsChangeStatus = document.querySelectorAll("[button-change-status]")
if(buttonsChangeStatus.length > 0) {
    buttonsChangeStatus.forEach(button => {
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
const buttonsDelete = document.querySelectorAll("[button-delete]")
if(buttonsDelete) {
    buttonsDelete.forEach(button => {
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