import { IsString, IsNotEmpty } from 'class-validator';

export class LoginValidation {
    @IsString()
    @IsNotEmpty({'message': 'Обязательное поле.'})
    loginOrEmail: string;

    @IsString()
    @IsNotEmpty({'message': 'Обязательное поле.'})
    password: string;
}