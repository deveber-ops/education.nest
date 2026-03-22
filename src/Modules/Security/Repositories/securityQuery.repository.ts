import {Injectable, UnauthorizedException} from "@nestjs/common";
import {PrismaService} from "../../../Database/prisma.service";
import {SecurityDeviceOutputType} from "../Types/security.types";
import {TokenPayloadType} from "../../Auth/Types/auth.types";
import {Devices} from "@prisma/client";

@Injectable()
export class SecurityQueryRepository {
    constructor(private prisma: PrismaService) {}

    async getUserDevices(userId: string): Promise<SecurityDeviceOutputType[]> {
        const devices = await this.prisma.devices.findMany({ where: { userId } });
        return devices.map((device) => ({
            ip: device.ip,
            title: device.title,
            lastActiveDate: device.lastActiveDate,
            deviceId: device.deviceId,
        }));
    }

    async getUserDevice(deviceId: string): Promise<Devices | null> {
        return await this.prisma.devices.findUnique({ where: { deviceId } });
    }

    async verifyDeviceToken(token: TokenPayloadType): Promise<Devices | null> {
        return await this.prisma.devices.findFirst({
            where: {
                jti: token.jti,
                expiresAt: {
                    gt: new Date()
                }
            }
        });
    }
}