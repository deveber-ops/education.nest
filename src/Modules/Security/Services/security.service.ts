import {ForbiddenException, Injectable, NotFoundException, UnauthorizedException} from "@nestjs/common";
import {SecurityRepository} from "../Repositories/security.repository";
import {RegisterDeviceType, SecurityDeviceOutputType} from "../Types/security.types";
import {SecurityQueryRepository} from "../Repositories/securityQuery.repository";
import {TokenPayloadType} from "../../Auth/Types/auth.types";
import {Devices} from "@prisma/client";

@Injectable()
export class SecurityService {
    constructor(
        private securityRepository: SecurityRepository,
        private securityQueryRepository: SecurityQueryRepository
    ) {}

    async registerDevice(data: RegisterDeviceType): Promise<void> {
        await this.securityRepository.registerDevice(data);
    }

    async getUserDevices(userId: string): Promise<SecurityDeviceOutputType[]> {
        return await this.securityQueryRepository.getUserDevices(userId);
    }

    async verifyDeviceToken(token: TokenPayloadType): Promise<SecurityDeviceOutputType | null | void> {
        const tokenExpires = await this.securityQueryRepository.verifyDeviceToken(token);
        if (!tokenExpires) {
            throw new UnauthorizedException("Токен авторизации недействителен.");
        }
    }

    async deleteAllUserDevicesExceptTheCurrentOne(userId: string, deviceId: string): Promise<void> {
        await this.securityRepository.deleteAllUserDevicesExceptTheCurrentOne(userId, deviceId);
    }

    async deleteUserDeviceById(userId: string, deviceId: string): Promise<void | null> {
        const device = await this.getUserDeviceById(deviceId)
        if (device?.userId !== userId) {
            throw new ForbiddenException({message: 'Вы не можете удалять чужие устройства.', field: 'deviceId'})
        }
        await this.securityRepository.deleteUserDevice(deviceId);
    }

    async getUserDeviceById(deviceId: string): Promise<Devices | null> {
        const device = await this.securityQueryRepository.getUserDevice(deviceId)

        if (!device) {
            throw new NotFoundException({message: 'Зарегистрированное устройство не найдено.', field: 'deviceId'});
        }

        return device;
    }
}