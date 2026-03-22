import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import {SortDirections} from "../../../Types/sortDirections.type";
import {PostSortFields} from "../Types/post.types";
import {Type} from "class-transformer";

export class PostPaginationQueryDto {
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
    @IsEnum(PostSortFields, {message: `Должен содержать одно из значений: ${Object.values(PostSortFields).join(', ')}`,})
    sortBy?: PostSortFields;

    @IsOptional()
    @IsEnum(SortDirections, {message: `Должен содержать одно из значений: ${Object.values(SortDirections).join(', ')}`,})
    sortDirection?: SortDirections;
}