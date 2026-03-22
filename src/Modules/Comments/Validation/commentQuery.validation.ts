import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import {SortDirections} from "../../../Types/sortDirections.type";
import {Type} from "class-transformer";
import {CommentSortFields} from "../Types/comment.types";

export class CommentPaginationQueryDto {
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
    @IsEnum(CommentSortFields, {message: `Должен содержать одно из значений: ${Object.values(CommentSortFields).join(', ')}`,})
    sortBy?: CommentSortFields;

    @IsOptional()
    @IsEnum(SortDirections, {message: `Должен содержать одно из значений: ${Object.values(SortDirections).join(', ')}`,})
    sortDirection?: SortDirections;
}