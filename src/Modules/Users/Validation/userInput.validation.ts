import {IsEmail, IsNotEmpty, IsString, Length, Matches} from 'class-validator';
import {IntersectionType} from "@nestjs/mapped-types";


export class EmailInputDto {
    @IsNotEmpty({ message: 'Обязательное поле.' })
    @IsString({ message: 'Должен быть строкой.' })
    @IsEmail({}, {message: 'Должен быть корректным e-mail адресом.'})
    email: string;
}

export class PasswordInputDto {
    @IsNotEmpty({ message: 'Обязательное поле.' })
    @IsString({ message: 'Должен быть строкой.' })
    @Length(6, 20, { message: 'Должен содержать от 6 до 20 символов.' })
    password: string;
}

export class NewPasswordInputDto {
    @IsNotEmpty({ message: 'Обязательное поле.' })
    @IsString({ message: 'Должен быть строкой.' })
    @Length(6, 20, { message: 'Должен содержать от 6 до 20 символов.' })
    newPassword: string;

    @IsNotEmpty({ message: 'Обязательное поле.' })
    @IsString({ message: 'Должен быть строкой.' })
    recoveryCode: string;
}

export class UserInputDto extends IntersectionType(
    EmailInputDto,
    PasswordInputDto,
) {
    @IsNotEmpty({ message: 'Обязательное поле.' })
    @IsString({ message: 'Должен быть строкой.' })
    @Length(3, 10, { message: 'Должен содержать от 3 до 10 символов.' })
    @Matches(/^[a-zA-Z0-9_-]*$/, {
        message: 'Может содержать только латинские буквы, цифры, дефис и нижнее подчёркивание',
    })
    login: string;
}