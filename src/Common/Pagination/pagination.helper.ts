import {SortDirections} from "../../Types/sortDirections.type";
import {PaginatedOutputType} from "../../Types/paginated.type";

export class PaginationHelper {
    static readonly DEFAULT_PAGE_NUMBER = 1;
    static readonly DEFAULT_PAGE_SIZE = 10;

    static setSortAndPagination<P extends string>(
        query: Partial<PaginatedOutputType<P>>,
        sortByDefault: P,
        sortDirectionDefault: SortDirections = SortDirections.DESC,
    ): PaginatedOutputType<P> {
        return {
            pageNumber: Number(query.pageNumber) || PaginationHelper.DEFAULT_PAGE_NUMBER,
            pageSize: Number(query.pageSize) || PaginationHelper.DEFAULT_PAGE_SIZE,
            sortBy: (query.sortBy ?? sortByDefault) as P,
            sortDirection: (query.sortDirection ?? sortDirectionDefault) as SortDirections,
        };
    }
}