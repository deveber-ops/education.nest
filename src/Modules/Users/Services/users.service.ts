import {BadRequestException, Injectable, NotFoundException} from "@nestjs/common";
import {UsersRepository} from "../Repositories/users.repository";
import {
    UserInputType, UserOutputType,
    UserPaginated,
    UserWithoutPassword
} from "../Types/user.types";
import * as bcrypt from 'bcrypt';
import {Prisma, Users} from "@prisma/client";
import {UsersQueryRepository} from "../Repositories/usersQuery.repository";
import {UserPaginationQueryDto} from "../Validation/userQuery.validation";
import {v4 as uuidv4} from "uuid";
import {EmailService} from "../../../Common/Services/email.service";

@Injectable()
export class UsersService {
    constructor(
        private usersRepo: UsersRepository,
        private usersQueryRepo: UsersQueryRepository,
        private emailService: EmailService,
    ) {}

    private buildConfirmationHtml(code: string): string {
        return `
          <h1>Восстановление пароля!</h1>
          <a href='https://edu.deveber.site/password-recovery?recoveryCode=${code}'>Подтвердить восстановление пароля</a>
          <p>Или введите его вручную. Код подтверждения: ${code}</p>
        `;
    }

    async findAll(query: UserPaginationQueryDto): Promise<UserPaginated> {
        return this.usersQueryRepo.findAll(query);
    }

    async findByLoginOrEmail(loginOrEmail: string): Promise<Users | null> {
        return await this.usersQueryRepo.findByLoginOrEmail(loginOrEmail);
    }

    async create(data: UserInputType): Promise<UserOutputType> {
        const salt = await bcrypt.genSalt(10);
        data.password = await bcrypt.hash(data.password, salt);

        try {
            const { password, recoveryCode, ...createdUser } = await this.usersRepo.create(data) as Users;
            return createdUser;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    const fields =
                        (error.meta as any)?.driverAdapterError?.cause?.constraint?.fields as string[] | undefined;

                    if (fields && fields.length > 0) {
                        throw new BadRequestException({message: `Пользователь с таким ${fields[0]} уже существует.`, field: fields[0]});
                    }
                }
            }
            throw error;
        }
    }

    async findOne(id: string): Promise<UserWithoutPassword | null> {
        return await this.usersQueryRepo.findOne(id)
    }

    async delete(id: string): Promise<void | object> {
        const user = await this.findOne(id)
        if (!user) {
            throw new NotFoundException({message: `Пользователь с указанным id: ${id} не найден.`, field: 'user'});
        }

        return await this.usersRepo.delete(id);
    }

    async passwordRecovery(email: string): Promise<void | object> {
        const recoveryCode = uuidv4()
        const user = await this.findByLoginOrEmail(email)

        if (!user) {
            return
        }

        await this.usersRepo.updateRecoveryCode(user.id, recoveryCode)
        await this.emailService.sendMail(email, 'Код восстановления пароля', '', this.buildConfirmationHtml(recoveryCode))
    }

    async verifyPasswordRecovery(code: string, newPassword: string): Promise<void | object> {
        const user = await this.usersQueryRepo.findByRecoveryCode(code)
        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash(newPassword, salt);

        if (!user) {
            throw new BadRequestException({message: `Код подтверждения просрочен или недействителен.`, field: 'recoveryCode'});
        }

        await this.usersRepo.updatePassword(user.id, password)
        await this.usersRepo.updateRecoveryCode(user.id, '')
    }
}