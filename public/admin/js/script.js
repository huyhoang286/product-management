//Button status
const buttonStatus = document.querySelectorAll("[button-status]")
if(buttonStatus.length > 0) {
    let url = new URL(window.location.href) //new URL() tạo ra đối tượng url với các thuộc tính thông minh, hỗ trở chỉnh sửa params
    buttonStatus.forEach(button => {
        button.addEventListener("click", ()=>{
            const status = button.getAttribute("button-status")
            if(status) {
                url.searchParams.set("status", status)
            } else {
                url.searchParams.delete("status")
            }
            window.location.href = url.href
        })
    })
}
//End button status

//Form search
const formSearch = document.querySelector("#form-search")
if(formSearch) {
    let url = new URL(window.location.href)
    formSearch.addEventListener("submit",(e)=>{
        e.preventDefault()
        const keyword = e.target.elements.keyword.value
        if(keyword) {
            url.searchParams.set("keyword", keyword)
        } else {
            url.searchParams.delete("keyword")
        }
        window.location.href = url.href
    })
}
//End Form search

//Pagination
const buttonsPagination = document.querySelectorAll("[button-pagination]")
if(buttonsPagination) {
    let url = new URL(window.location.href) 
    buttonsPagination.forEach(button => {
        button.addEventListener("click", ()=> {
            const page = button.getAttribute("button-pagination")
            url.searchParams.set("page", page)
            window.location.href = url.href
        })
    })
}
//End Pagination

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

            const path = formChangeMulti.getAttribute("data-path")

            //Đóng gói logic Fetch API vào một hàm để tái sử dụng
            const sendRequest = () => {
                fetch(path, {
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
                        // Nếu là xóa hoặc khôi phục, xóa luôn dòng đó trên giao diện
                        if(typeChange == "delete-all" || typeChange == "restore-all" || typeChange == "delete-permanent-all") {
                            inputsChecked.forEach(input => {
                                input.closest("tr").remove()
                            })
                        } else {
                            // Nếu đổi trạng thái (active/inactive) 
                            inputsChecked.forEach(input => {
                                const tr = input.closest("tr");
        
                                const buttonStatus = tr.querySelector("[button-change-status]");
        
                                if(buttonStatus) {
                                    buttonStatus.setAttribute("data-status", typeChange);
                                    if(typeChange == "active") {
                                        buttonStatus.classList.remove("badge-danger");
                                        buttonStatus.classList.add("badge-success");
                                        buttonStatus.innerHTML = "Hoạt động";
                                    } else if (typeChange == "inactive") {
                                        buttonStatus.classList.remove("badge-success");
                                        buttonStatus.classList.add("badge-danger");
                                        buttonStatus.innerHTML = "Dừng hoạt động";
                                    }
                                }
                            })
                        }
                        //Bỏ chọn ô Check all
                        const inputCheckAll = document.querySelector("input[name='checkall']");
                        if(inputCheckAll) {
                            inputCheckAll.checked = false;
                        }
                    }
                })
            }
            //Nếu là xóa hàng loạt thì phải hiện thông báo xác nhận
            if(typeChange == "delete-all" || typeChange == "delete-permanent-all") {
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
                    if(result.isConfirmed) {
                        sendRequest()
                    }
                })
            } else {
                //Nếu là các hành động khác như active/ inactive, restore thì không cần thông báo xác nhận
                sendRequest()
            }
        } else {
            alert("Vui lòng chọn ít nhất một bản ghi!")
        }
    })
}
// End Form Change Multi