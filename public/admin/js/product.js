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

// CheckBox Multi
const checkboxMulti = document.querySelector("[checkbox-multi]")
if(checkboxMulti) {
    const inputCheckAll = checkboxMulti.querySelector("input[name='checkall']")
    const inputsId = checkboxMulti.querySelectorAll("input[name='id']")
    
    //Khi click vào chọn tất cả
    inputCheckAll.addEventListener("click", () => {
        if(inputCheckAll.checked) {
            inputsId.forEach(input => {
                input.checked = true
            })
        } else {
            inputsId.forEach(input => {
                input.checked = false
            })
        }
    })

    //Khi click vào từng nút lẻ
    inputsId.forEach(input => {
        input.addEventListener("click", () => {
            const countChecked = checkboxMulti.querySelectorAll("input[name='id']:checked").length
            if(countChecked == inputsId.length) {
                inputCheckAll.checked = true
            } else {
                inputCheckAll.checked = false
            }
        })
    })
}
// End CheckBox Multi

// Form Change Multi
const formChangeMulti = document.querySelector("[form-change-multi]")
if(formChangeMulti) {
    formChangeMulti.addEventListener("submit", (e) => {
        e.preventDefault()

        const checkboxMulti = document.querySelector("[checkbox-multi]")
        const inputsChecked = checkboxMulti.querySelectorAll("input[name='id']:checked")

        const typeChange = e.target.elements.type.value
        if(typeChange == "") {
            alert("Vui lòng chọn hành đông!")
            return
        }

        if(inputsChecked.length > 0) {
            //Gom danh sách id cần đổi trạng thái
            let ids = []
            inputsChecked.forEach(input => {
                ids.push(input.value)
            })

            fetch("/admin/products/change-multi", {
                method: "PATCH",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({
                    type: typeChange,
                    ids: ids
                })
            })  
            .then(res => res.json())
            .then(data => {
                if(data.code == 200) {
                    Swal.fire({
                        toast: true,
                        position: "top-end",
                        icon: "success",
                        title: data.message,
                        showConfirmButton: false,
                        timer: 2000
                    });
                    location.reload()
                }
            })
        } else {
            alert("Vui lòng chọn ít nhất một bản ghi!")
        }
    })
}
// End Form Change Multi