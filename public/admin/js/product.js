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
                text: "Hành động này sẽ xóa vĩnh viễn sản phẩm khỏi hệ thống!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6",
                confirmButtonText: "Xóa!",
                cancelButtonText: "Hủy!"
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