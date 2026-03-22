import { Users } from '@prisma/client';
import {Paginator} from "../../../Types/paginated.type";

export enum UserSortFields {
    createdAt = 'createdAt',
}

export type UserWithoutPassword = Omit<Users, 'password'>;
export type UserOutputType = Omit<Users, 'password' | 'recoveryCode'>;

export type UserPaginated = Paginator<UserOutputType>;

export type UserInputType = {
    login: string;
    password: string;
    email: string;
}

export type UserCreateType = UserInputType & {
    passwordHash: string;
}

