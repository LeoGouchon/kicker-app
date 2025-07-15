export type Pagination<T> = {
    content: T[],
    currentPage: number,
    totalPages: number,
    totalElements: number,
    pageSize: number
}