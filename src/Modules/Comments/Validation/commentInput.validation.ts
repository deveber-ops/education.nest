import {IsNotEmpty, IsString, Length} from 'class-validator';

export class CommentInputDto {
    @IsNotEmpty({ message: 'Обязательное поле.' })
    @IsString({ message: 'Должен быть строкой.' })
    @Length(20, 300, { message: 'Должен содержать от 20 до 300 символов.' })
    content: string;
}