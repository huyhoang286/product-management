// LOGIN
const formLogin = document.querySelector("#form-login");
if (formLogin) {
    formLogin.addEventListener("submit", (e) => {
        e.preventDefault(); 
        
        const formData = new FormData(formLogin);

        fetch(`/admin/auth/login`, {
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
                    window.location.href = "/admin/dashboard"; 
                });
            } else {
                Swal.fire({ icon: 'error', title: 'Thất bại!', text: data.message });
            }
        })
        .catch(error => console.log("Lỗi Fetch API:", error));
    });
}
// End LOGIN
