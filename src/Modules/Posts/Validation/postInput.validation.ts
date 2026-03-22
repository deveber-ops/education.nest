import {IsNotEmpty, IsString, IsUUID, MaxLength} from 'class-validator';

export class PostInputDto {
    @IsNotEmpty({ message: 'Обязательное поле.' })
    @IsString({ message: 'Должен быть строкой.' })
    @MaxLength(30, { message: 'Должен содержать до 30 символов.' })
    title: string;

    @IsNotEmpty({ message: 'Обязательное поле.' })
    @IsString({ message: 'Должен быть строкой.' })
    @MaxLength(100, { message: 'Должен содержать до 100 символов.' })
    shortDescription: string;

    @IsNotEmpty({ message: 'Обязательное поле.' })
    @IsString({ message: 'Должен быть строкой.' })
    @MaxLength(1000, { message: 'Должен содержать до 1000 символов.' })
    content: string;
}

export class PostBlogIdValidation extends PostInputDto {
    @IsNotEmpty({ message: 'Обязательное поле.' })
    @IsString({ message: 'Должен быть строкой.' })
    @IsUUID('4', { message: 'Должен быть корректным UUID v4.' })
    blogId: string;
}