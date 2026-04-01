
module.exports = (query) => {
    let sort = {};

    if (query.sortKey && query.sortValue) {
        sort[query.sortKey] = query.sortValue;
    } else {
        sort.createdAt = "desc";
    }

    return sort;
}