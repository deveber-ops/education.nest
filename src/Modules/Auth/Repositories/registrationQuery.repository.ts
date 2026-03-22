import {Injectable} from "@nestjs/common";
import {PrismaService} from "../../../Database/prisma.service";
import {Registrations} from "@prisma/client";

@Injectable()
export class RegistrationQueryRepository {
    constructor(private prisma: PrismaService) {}

    async getRegistrationByEmailOrCode(emailOrCode: string): Promise<Registrations | null> {
        return this.prisma.registrations.findFirst({
            where: {
                OR: [
                    { email: emailOrCode },
                    { verificationCode: emailOrCode },
                ],
            },
        });
    }
}