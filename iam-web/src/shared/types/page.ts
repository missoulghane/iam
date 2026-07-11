// Mirrors PagedUserResponse (and any future PagedXxxResponse) from the OpenAPI schema.
export interface PageResponse<T> {
  content: T[]
  pageNumber: number
  pageSize: number
  totalElements: number
  totalPages: number
}
