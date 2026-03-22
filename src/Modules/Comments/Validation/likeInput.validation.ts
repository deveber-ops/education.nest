import {IsEnum, IsNotEmpty} from "class-validator";
import {LikeStatusFields} from "../Types/comment.types";

export class LikeInputDto {
    @IsNotEmpty({message: `Обязательное поле.`,})
    @IsEnum(LikeStatusFields, {message: `Доложен содержать одно из значений: ${Object.values(LikeStatusFields).join(', ')}`,})
    likeStatus: LikeStatusFields;
}