module.exports = (query) => {
    let objectSearch = {
        keyword : ""
    }
    if(query.keyword) {
        objectSearch.keyword = query.keyword
        objectSearch.regex = {
            $regex : objectSearch.keyword,
            $options: 'i'
        }
    }
    return objectSearch
}