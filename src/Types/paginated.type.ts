import {SortDirections} from "./sortDirections.type";

export type PaginatedOutputType<P extends string = string> = {
    pageNumber: number;        // текущая страница
    pageSize: number;          // размер страницы
    sortBy: P;                 // поле сортировки
    sortDirection: SortDirections; // направление сортировки (ASC | DESC)
};

export type Paginator<T, P extends string = string> = {
    pagesCount: number;
    page: number;
    pageSize: number;
    totalCount: number;
    items: T[];
};