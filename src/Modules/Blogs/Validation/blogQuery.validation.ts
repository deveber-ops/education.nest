import {SortDirections} from "../../../Types/sortDirections.type";
import {BlogSortFields} from "../Types/blog.types";
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class BlogPaginationQueryDto {
    @IsOptional()
    @Type(() => Number)
    @IsInt({'message': 'Должен иметь положительное число.'})
    @Min(1, {'message': 'Должен быть больше 1.'})
    pageNumber?: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt({'message': 'Должен иметь положительное число.'})
    @Min(1, {'message': 'Должен быть больше 1.'})
    pageSize?: number;

    @IsOptional()
    @IsEnum(BlogSortFields, {message: `Должен содержать одно из значений: ${Object.values(BlogSortFields).join(', ')}`,})
    sortBy?: BlogSortFields;

    @IsOptional()
    @IsEnum(SortDirections, {message: `Должен содержать одно из значений: ${Object.values(SortDirections).join(', ')}`,})
    sortDirection?: SortDirections;
}