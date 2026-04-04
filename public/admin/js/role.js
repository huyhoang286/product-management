//Xử lý nhóm quyền và phân quyền

// Create Role
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
                alert(data.message);
                window.location.href = "/admin/roles"; 
            } else {
                alert(data.message);
            }
        })
        .catch(error => console.log("Lỗi Fetch API:", error));
    });
}
// End Create Role

// Edit Role
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
                alert(data.message);
                window.location.href = "/admin/roles"; 
            } else {
                alert(data.message);
            }
        })
        .catch(error => console.log("Lỗi Fetch API:", error));
    });
}
// End Edit Role

// Delete Role
const buttonsDeleteRole = document.querySelectorAll("[button-delete-role]");
if (buttonsDeleteRole.length > 0) {
    buttonsDeleteRole.forEach(button => {
        button.addEventListener("click", () => {
            const isConfirm = confirm("CẢNH BÁO: Bạn có chắc chắn muốn xóa vĩnh viễn nhóm quyền này khỏi hệ thống không?");
            
            if (isConfirm) {
                const id = button.getAttribute("data-id");
                
                fetch(`/admin/roles/delete/${id}`, {
                    method: "DELETE"
                })
                .then(res => res.json())
                .then(data => {
                    if (data.code === 200) {
                        alert(data.message);
                        window.location.reload(); 
                    } else {
                        alert(data.message);
                    }
                })
                .catch(error => console.log("Lỗi Fetch API:", error));
            }
        });
    });
}
// End Delete Role