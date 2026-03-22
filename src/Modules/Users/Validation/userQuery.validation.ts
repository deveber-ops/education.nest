import {IsEnum, IsInt, IsOptional, Min} from "class-validator";
import {Type} from "class-transformer";
import {SortDirections} from "../../../Types/sortDirections.type";
import {UserSortFields} from "../Types/user.types";

export class UserPaginationQueryDto {
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
    @IsEnum(UserSortFields, {message: `Должен содержать одно из значений: ${Object.values(UserSortFields).join(', ')}`,})
    sortBy?: UserSortFields;

    @IsOptional()
    @IsEnum(SortDirections, {message: `Должен содержать одно из значений: ${Object.values(SortDirections).join(', ')}`,})
    sortDirection?: SortDirections;

    @IsOptional()
    searchLoginTerm?: string;

    @IsOptional()
    searchEmailTerm?: string;
}