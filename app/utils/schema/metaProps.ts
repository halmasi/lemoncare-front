export interface MetaProps {
  pagination: PaginationProps;
}

export interface PaginationProps {
  page: number;
  pageCount: number;
  pageSize: number;
  total: number;
}
