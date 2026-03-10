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
    
            // console.log(statusCurrent)
            // console.log(id)
            // console.log(statusChange)
        })
    })
}
// End Change Status

