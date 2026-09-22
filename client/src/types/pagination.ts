export interface Pagination {
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
}

export interface PaginationResult<T> {
    metadata: Pagination;
    items: T[];
}