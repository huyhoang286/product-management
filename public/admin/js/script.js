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

//Preview image
const uploadImage = document.querySelector("[upload-image]")
if(uploadImage) {
    const uploadImageInput = document.querySelector("[upload-image-input]")
    const uploadImagePreview = document.querySelector("[upload-image-preview]")
    const uploadImageClose = document.querySelector("[upload-image-close]")
    //Khi thêm ảnh
    uploadImageInput.addEventListener("change", (e) => {
        const file = e.target.files[0]
        if(file) {
            uploadImagePreview.src = URL.createObjectURL(file)
        }
    })
    //Khi xóa ảnh
    uploadImageClose.addEventListener("click", () => {
        uploadImageInput.value = ""
        uploadImagePreview.src = ""
    })
}
//End Preview image

// Hiển thị thông báo từ chuyển hướng API
const successMessage = sessionStorage.getItem("successMessage");
if (successMessage) {
    Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: successMessage,
        showConfirmButton: false,
        timer: 2000
    });
    
    sessionStorage.removeItem("successMessage");
}

// Sort
const sort = document.querySelector("[sort]")
if(sort) {
    let url = new URL(window.location.href)
    const sortSelect = document.querySelector("[sort-select]")
    sortSelect.addEventListener("change", (e) => {
        const value = e.target.value
        if(value) {
            const [sortKey, sortValue] = value.split("-")
            url.searchParams.set("sortKey", sortKey)
            url.searchParams.set("sortValue", sortValue)
        }
        else {
            url.searchParams.delete("sortKey");
            url.searchParams.delete("sortValue");
        }
        window.location.href = url.href
    })
    const sortKey = url.searchParams.get("sortKey");
    const sortValue = url.searchParams.get("sortValue");

    if (sortKey && sortValue) {
        const stringSort = `${sortKey}-${sortValue}`;
        const optionSelected = sortSelect.querySelector(`option[value='${stringSort}']`);
        if (optionSelected) {
            optionSelected.selected = true;
        }
    }
    
}
// End Sort

// TreeTable: Đóng/Mở danh mục con
const buttonsToggle = document.querySelectorAll("[button-toggle-tree]");
if (buttonsToggle.length > 0) {
    buttonsToggle.forEach(button => {
        button.addEventListener("click", () => {
            const id = button.getAttribute("button-toggle-tree");
            
            const isExpanded = button.innerText === "-";
            
            button.innerText = isExpanded ? "+" : "-";

            const toggleChildren = (parentId, show) => {
                const childrenRows = document.querySelectorAll(`tr[data-parent-id='${parentId}']`);
                
                childrenRows.forEach(row => {
                    if (show) {
                        row.classList.remove("d-none");
                    } else {
                        row.classList.add("d-none");
                        
                        const rowId = row.getAttribute("data-id");
                        const btn = row.querySelector("[button-toggle-tree]");
                        if (btn) btn.innerText = "+"; 
                        
                        toggleChildren(rowId, false); 
                    }
                });
            };

            toggleChildren(id, !isExpanded);
        });
    });
}
// End TreeTable: Đóng/Mở danh mục con

// Add category
const formCreateCategory = document.querySelector("#form-create-category");
if (formCreateCategory) {
    formCreateCategory.addEventListener("submit", (e) => {
        e.preventDefault(); 
        
        if (typeof tinymce !== "undefined") {
            tinymce.triggerSave();
        }

        const formData = new FormData(formCreateCategory);

        fetch(`/admin/products-category/create`, {
            method: "POST",
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            if (data.code === 200) {
                sessionStorage.setItem("successMessage", data.message);
                window.location.reload();
            } else {
                Swal.fire({ icon: 'error', title: 'Lỗi!', text: data.message });
            }
        })
        .catch(error => console.error("Lỗi Fetch API:", error));
    });
}
// End Add category

// Delete category
const buttonsDelete = document.querySelectorAll("[button-delete]");
if (buttonsDelete.length > 0) {
    buttonsDelete.forEach(button => {
        button.addEventListener("click", () => {
            const isConfirm = confirm("Bạn có chắc muốn xóa bản ghi này?");
            
            if (isConfirm) {
                const id = button.getAttribute("data-id");
                
                fetch(`/admin/products-category/delete/${id}`, {
                    method: "DELETE"
                })
                .then(res => res.json())
                .then(data => {
                    if (data.code === 200) {
                        sessionStorage.setItem("successMessage", data.message);
                        window.location.reload();
                    } else {
                        Swal.fire({ icon: 'error', title: 'Lỗi!', text: data.message });
                    }
                })
                .catch(error => console.log(error));
            }
        });
    });
}
// End Delete Category

// Form Edit Category
const formEditCategory = document.querySelector("#form-edit-category");
if (formEditCategory) {
    formEditCategory.addEventListener("submit", (e) => {
        e.preventDefault(); 
        
        if (typeof tinymce !== "undefined") {
            tinymce.triggerSave();
        }

        const id = formEditCategory.getAttribute("data-id"); 
        const formData = new FormData(formEditCategory);

        fetch(`/admin/products-category/edit/${id}`, {
            method: "PATCH",
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            if (data.code === 200) {
                sessionStorage.setItem("successMessage", data.message);
                window.location.reload();
            } else {
                Swal.fire({ icon: 'error', title: 'Lỗi!', text: data.message });
            }
        })
        .catch(error => {
            console.error("Lỗi Fetch API:", error);
            alert("Có lỗi xảy ra, vui lòng thử lại!");
        });
    });
}
// End Form Edit Category

// Change status category
const buttonsChangeStatus = document.querySelectorAll("[button-change-status]");
if (buttonsChangeStatus.length > 0) {
    buttonsChangeStatus.forEach(button => {
        button.addEventListener("click", () => {
            const statusCurrent = button.getAttribute("data-status");
            const id = button.getAttribute("data-id");

            const statusChange = statusCurrent === "active" ? "inactive" : "active";
            
            const apiPath = `/admin/products-category/change-status/${statusChange}/${id}`;

            fetch(apiPath, {
                method: "PATCH"
            })
            .then(res => res.json())
            .then(data => {
                if (data.code === 200) {
                    if (statusChange === "active") {
                        button.innerText = "Hoạt động";
                        button.classList.remove("badge-danger");
                        button.classList.add("badge-success");
                        button.setAttribute("data-status", "active");
                    } else {
                        button.innerText = "Dừng hoạt động";
                        button.classList.remove("badge-success");
                        button.classList.add("badge-danger");
                        button.setAttribute("data-status", "inactive");
                    }
                }
            })
            .catch(error => console.log(error));
        });
    });
}
// End Change status category

// CẬP NHẬT TRẠNG THÁI ĐƠN HÀNG 
const selectStatuses = document.querySelectorAll("[select-status]");
if(selectStatuses.length > 0) {
    selectStatuses.forEach(select => {
        select.addEventListener("change", (e) => {
            const id = select.getAttribute("order-id");
            const status = e.target.value;

            const pathAdmin = window.location.pathname.split("/")[1]; 

            fetch(`/${pathAdmin}/orders/change-status/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: status })
            })
            .then(res => res.json())
            .then(data => {
                if(data.code === 200) {
                    Swal.fire({
                        toast: true,
                        position: 'top-end',
                        icon: 'success',
                        title: data.message,
                        showConfirmButton: false,
                        timer: 2000
                    });

                    setTimeout(() => {
                        window.location.reload(); 
                    }, 2000);
                }
            });
        });
    });
}