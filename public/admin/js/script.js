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