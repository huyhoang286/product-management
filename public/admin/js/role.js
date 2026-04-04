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