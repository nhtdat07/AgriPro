export const getNextPagination = (limit, offset, num) => {
    if (num < limit) {
        limit = num;
    }
    return { offset: limit + offset };
};