module.exports = (query) => {
    let filterStatus = [
        {
            name: "Tất cả",
            status: "",
            class: ""
        },
        {
            name: "Hoạt động",
            status: "active",
            class: ""
        },
        {
            name: "Dừng hoạt động",
            status: "inactive",
            class: ""
        }
    ]
    //Cài đặt trạng thái active (highlight màu xanh) cho button khi nhấn
    if(query.status) {
        const index = filterStatus.findIndex(item => item.status == query.status)
        filterStatus[index].class = "active"
    } else {
        const index = filterStatus.findIndex(item => item.status == "")
        filterStatus[index].class = "active"
    }
    return filterStatus
    // End Cài đặt trạng thái active
}