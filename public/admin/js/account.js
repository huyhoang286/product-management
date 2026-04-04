//Add account
const formCreateAccount = document.querySelector("#form-create-account");
if (formCreateAccount) {
    formCreateAccount.addEventListener("submit", (e) => {
        e.preventDefault(); 
        
        const formData = new FormData(formCreateAccount);

        fetch(`/admin/accounts/create`, {
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
                    window.location.href = "/admin/accounts"; 
                });
            } else {
                Swal.fire({ icon: 'error', title: 'Lỗi!', text: data.message });
            }
        })
        .catch(error => console.log("Lỗi Fetch API:", error));
    });
}
//End Add account

// Edit account
const formEditAccount = document.querySelector("#form-edit-account");
if (formEditAccount) {
    formEditAccount.addEventListener("submit", (e) => {
        e.preventDefault(); 
        
        const id = formEditAccount.getAttribute("data-id");
        const formData = new FormData(formEditAccount);

        fetch(`/admin/accounts/edit/${id}`, {
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
                    window.location.href = "/admin/accounts"; 
                });
            } else {
                Swal.fire({ icon: 'error', title: 'Lỗi!', text: data.message });
            }
        })
        .catch(error => console.log("Lỗi Fetch API:", error));
    });
}
//End Edit account

// Change status account
const buttonsChangeStatusAccount = document.querySelectorAll("[button-change-status-account]");
if (buttonsChangeStatusAccount.length > 0) {
    buttonsChangeStatusAccount.forEach(button => {
        button.addEventListener("click", () => {
            const currentStatus = button.getAttribute("data-status");
            const id = button.getAttribute("data-id");
            
            const newStatus = currentStatus === "active" ? "inactive" : "active";

            fetch(`/admin/accounts/change-status/${newStatus}/${id}`, {
                method: "PATCH"
            })
            .then(res => res.json())
            .then(data => {
                if (data.code === 200) {
                    Swal.fire({
                        icon: 'success',
                        title: data.message,
                        showConfirmButton: false,
                        timer: 1000
                    }).then(() => {
                        window.location.reload(); 
                    });
                }
            })
            .catch(error => console.log("Lỗi Fetch API:", error));
        });
    });
}
// End Change status account

// Delete account
const buttonsDeleteAccount = document.querySelectorAll("[button-delete-account]");
if (buttonsDeleteAccount.length > 0) {
    buttonsDeleteAccount.forEach(button => {
        button.addEventListener("click", () => {
            Swal.fire({
                title: "CẢNH BÁO",
                text: "Bạn có chắc chắn muốn xóa tài khoản này không?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6",
                confirmButtonText: "Vâng, xóa nó!",
                cancelButtonText: "Hủy"
            }).then((result) => {
                if (result.isConfirmed) {
                    const id = button.getAttribute("data-id");
                    
                    fetch(`/admin/accounts/delete/${id}`, {
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
                        }
                    })
                    .catch(error => console.log("Lỗi Fetch API:", error));
                }
            });
        });
    });
}
//End Delete account