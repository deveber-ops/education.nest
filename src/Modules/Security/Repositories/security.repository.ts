import {Injectable} from "@nestjs/common";
import {PrismaService} from "../../../Database/prisma.service";
import {CurrentDeviceType, RegisterDeviceType, UpdateDeviceType} from "../Types/security.types";
import {Devices} from "@prisma/client";

@Injectable()
export class SecurityRepository {
    constructor(private prisma: PrismaService) {
    }

    async registerDevice(data: RegisterDeviceType): Promise<void> {
        try {
            await this.prisma.devices.update({ where: { deviceId: data.deviceId }, data: {
                ...data,
                lastActiveDate: new Date(),
            }});
        } catch (error) {
            await this.prisma.devices.create({data});
        }
    }

    async deleteAllUserDevicesExceptTheCurrentOne(
        userId: string,
        currentDeviceId: string,
    ): Promise<void> {
        await this.prisma.devices.deleteMany({
            where: {
                userId,
                NOT: {
                    deviceId: currentDeviceId,
                },
            },
        });
    }

    async deleteUserDevice(deviceId: string): Promise<void | null> {
        await this.prisma.devices.delete({ where: { deviceId } });
    }
}