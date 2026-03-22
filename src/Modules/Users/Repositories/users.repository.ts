import {Injectable} from "@nestjs/common";
import {PrismaService} from "../../../Database/prisma.service";
import {UserInputType, UserOutputType} from "../Types/user.types";

@Injectable()
export class UsersRepository {
    constructor(
        private prisma: PrismaService
    ) {}

    async create(data: UserInputType): Promise<UserOutputType> {
        return await this.prisma.users.create({ data });
    }

    async delete (id: string): Promise<void | object> {
        return await this.prisma.users.delete({ where: { id } });
    }

    async updateRecoveryCode(userId: string, recoveryCode: string): Promise<void | object> {
        await this.prisma.users.update({ where: { id: userId }, data: { recoveryCode } });
    }

    async updatePassword(userId: string, password: string): Promise<void | object> {
        await this.prisma.users.update({ where: { id: userId }, data: { password } });
    }
}