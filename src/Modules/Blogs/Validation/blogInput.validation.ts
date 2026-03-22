import {IsNotEmpty, IsString, IsUrl, MaxLength} from 'class-validator';

export class BlogInputDto {
    @IsNotEmpty({ message: 'Обязательное поле.' })
    @IsString({ message: 'Должен быть строкой.' })
    @MaxLength(15, { message: 'Должен содержать до 15 символов.' })
    name: string;

    @IsNotEmpty({ message: 'Обязательное поле.' })
    @IsString({ message: 'Должен быть строкой.' })
    @MaxLength(500, { message: 'Должен содержать до 500 символов.' })
    description: string;

    @IsNotEmpty({ message: 'Обязательное поле.' })
    @IsString({ message: 'Должен быть строкой.' })
    @MaxLength(100, { message: 'Должен содержать до 100 символов.' })
    @IsUrl({}, { message: 'Должен быть валидной ссылкой, пример: https://somesite.com.' })
    websiteUrl: string;
}