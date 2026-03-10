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
                text: "Hành động này sẽ chuyển sản phẩm vào thùng rác!",
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

// Delete Permanent Item
const buttonsDeletePermanent = document.querySelectorAll("[button-delete-permanent]")
if(buttonsDeletePermanent) {
    buttonsDeletePermanent.forEach(button => {
        button.addEventListener("click", () => {
            const id = button.getAttribute("data-id")
            Swal.fire({
                title: "Bạn có chắc chắn muốn xóa vĩnh viễn?",
                text: "Sản phẩm sẽ bị xóa vĩnh viễn và KHÔNG THỂ khôi phục!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6",
                confirmButtonText: "Xóa vĩnh viễn",
                cancelButtonText: "Hủy"
            }).then((result) => {
                if(result.isConfirmed) {
                    const path = `/admin/products/delete-permanent/${id}`
                    fetch(path, {
                        method: "DELETE"
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
                            })
                        }
                    })

                }
            })
            
        })
    })
}
// End Delete Permanent Item