import {IsUUID} from "class-validator";

export class idValidation {
    @IsUUID('4', { message: 'Должен быть корректным UUID v4.' })
    id: string;
}