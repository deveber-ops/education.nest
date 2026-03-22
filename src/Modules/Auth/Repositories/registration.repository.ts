import {Injectable} from "@nestjs/common";
import {PrismaService} from "../../../Database/prisma.service";
import {UserInputType} from "../../Users/Types/user.types";
import {Registrations} from "@prisma/client";
import {ConfigService} from "@nestjs/config";

@Injectable()
export class RegistrationRepository {
    constructor(
        private prisma: PrismaService,
        private configService: ConfigService
    ) {}

    async setNewRegistration(data: UserInputType): Promise<Registrations> {
        const codeExpires = Number(this.configService.getOrThrow<number>('CONFIRMATION_CODE_EXPIRES_MINUTES'))
        const registrationData = {
            ...data,
            codeExpires: new Date(Date.now() + codeExpires * 60 * 1000),
        }
        return await this.prisma.registrations.create({data: registrationData});
    }

    async updateRegistration(email: string, verificationCode: string, codeExpires: Date): Promise<void | object> {
        return await this.prisma.registrations.update({
            where: { email },
            data: {
                verificationCode,
                codeExpires,
            }
        })
    }

    async deleteRegistration(id: string): Promise<void | object> {
        await this.prisma.registrations.delete({where: { id }})
    }
}