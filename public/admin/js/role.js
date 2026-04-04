//Creat Role
const formCreateRole = document.querySelector("#form-create-role");
if (formCreateRole) {
    formCreateRole.addEventListener("submit", (e) => {
        e.preventDefault(); 
        
        const formData = new FormData(formCreateRole);

        fetch(`/admin/roles/create`, {
            method: "POST",
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            if (data.code === 200) {
                Swal.fire({
                    icon: 'success',
                    title: data.message,
                    showConfirmButton: false,
                    timer: 1500
                }).then(() => {
                    window.location.href = "/admin/roles"; 
                });
            } else {
                Swal.fire({ icon: 'error', title: 'Lỗi!', text: data.message });
            }
        })
        .catch(error => console.log("Lỗi Fetch API:", error));
    });
}
//End Creat Role

//Edit Role
const formEditRole = document.querySelector("#form-edit-role");
if (formEditRole) {
    formEditRole.addEventListener("submit", (e) => {
        e.preventDefault(); 
        
        const id = formEditRole.getAttribute("data-id"); 
        const formData = new FormData(formEditRole);

        fetch(`/admin/roles/edit/${id}`, {
            method: "PATCH",
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            if (data.code === 200) {
                Swal.fire({
                    icon: 'success',
                    title: data.message,
                    showConfirmButton: false,
                    timer: 1500
                }).then(() => {
                    window.location.href = "/admin/roles"; 
                });
            } else {
                Swal.fire({ icon: 'error', title: 'Lỗi!', text: data.message });
            }
        })
        .catch(error => console.log("Lỗi Fetch API:", error));
    });
}
//End Edit Role

//Delete Role
const buttonsDeleteRole = document.querySelectorAll("[button-delete-role]");
if (buttonsDeleteRole.length > 0) {
    buttonsDeleteRole.forEach(button => {
        button.addEventListener("click", () => {
            Swal.fire({
                title: "CẢNH BÁO",
                text: "Bạn có chắc chắn muốn xóa vĩnh viễn nhóm quyền này không? Hành động này không thể hoàn tác!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6",
                confirmButtonText: "Vâng, xóa nó!",
                cancelButtonText: "Hủy"
            }).then((result) => {
                if (result.isConfirmed) {
                    const id = button.getAttribute("data-id");
                    
                    fetch(`/admin/roles/delete/${id}`, {
                        method: "DELETE"
                    })
                    .then(res => res.json())
                    .then(data => {
                        if (data.code === 200) {
                            Swal.fire({
                                icon: 'success',
                                title: 'Đã xóa!',
                                text: data.message,
                                showConfirmButton: false,
                                timer: 1500
                            }).then(() => {
                                window.location.reload(); 
                            });
                        } else {
                            Swal.fire({ icon: 'error', title: 'Lỗi!', text: data.message });
                        }
                    })
                    .catch(error => console.log("Lỗi Fetch API:", error));
                }
            });
        });
    });
}
//Delete Role

//Permissions
// Hiển thị mặc định các quyền đã tích
const dataRecords = document.querySelector("[data-records]");
if (dataRecords) {
    const records = JSON.parse(dataRecords.getAttribute("data-records"));
    const tablePermissions = document.querySelector("[table-permissions]");

    if (tablePermissions) {
        records.forEach((record, index) => {
            const permissions = record.permissions; 
            
            permissions.forEach(permission => {
                const row = tablePermissions.querySelector(`[data-name="${permission}"]`);
                if (row) {
                    const input = row.querySelectorAll("input")[index];
                    if (input) {
                        input.checked = true; 
                    }
                }
            });
        });
    }
}

// Gom dữ liệu và gửi API Cập nhật 
const buttonSubmit = document.querySelector("[button-submit]");
if (buttonSubmit) {
    buttonSubmit.addEventListener("click", () => {
        const permissions = [];
        const tablePermissions = document.querySelector("[table-permissions]");
        const rows = tablePermissions.querySelectorAll("tbody tr[data-name]");

        rows.forEach(row => {
            const name = row.getAttribute("data-name"); 
            const inputs = row.querySelectorAll("input");

            if (name === "id") {
                inputs.forEach(input => {
                    permissions.push({
                        id: input.value,
                        permissions: [] 
                    });
                });
            } else {
                inputs.forEach((input, index) => {
                    if (input.checked) {
                        permissions[index].permissions.push(name);
                    }
                });
            }
        });

        console.log("Cục dữ liệu chuẩn bị gửi đi:", permissions);

        const formData = new FormData();
        formData.append("permissions", JSON.stringify(permissions));

        fetch(`/admin/roles/permissions`, {
            method: "PATCH",
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            if (data.code === 200) {
                Swal.fire({
                    icon: 'success',
                    title: data.message,
                    showConfirmButton: false,
                    timer: 1500
                }).then(() => {
                    window.location.reload(); 
                });
            } else {
                Swal.fire({ icon: 'error', title: 'Lỗi!', text: data.message });
            }
        })
        .catch(error => console.log("Lỗi Fetch API Phân quyền:", error));
    });
}

//Nút Chọn tất cả
const tablePermissionsCheckAll = document.querySelector("[table-permissions]");
if (tablePermissionsCheckAll) {
    const checkAllInputs = tablePermissionsCheckAll.querySelectorAll("input[input-check-all-column]");
    
    checkAllInputs.forEach((checkAllInput, index) => {
        checkAllInput.addEventListener("click", () => {
            const isChecked = checkAllInput.checked;
            
            const rows = tablePermissionsCheckAll.querySelectorAll("tbody tr[data-name]:not([data-name='id'])");
            
            rows.forEach(row => {
                const inputs = row.querySelectorAll("input");
                if (inputs[index]) {
                    inputs[index].checked = isChecked;
                }
            });
        });
    });
}
//End Permissions