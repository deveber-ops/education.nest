import {Controller, Delete, Get, HttpCode, HttpStatus, Param, UseGuards} from "@nestjs/common";
import {RefreshTokenAuthGuard} from "../../Guards/Bearer/refreshToken-auth.guard";
import {SecurityService} from "../Services/security.service";
import {CurrentUser} from "../../../Common/Decorators/currentUser.decorator";
import {TokenPayloadType} from "../../Auth/Types/auth.types";

@Controller('security')
@UseGuards(RefreshTokenAuthGuard)
export class SecurityController {
    constructor(private securityService: SecurityService) {}

    @Get('devices')
    async getUserDevices(@CurrentUser() userPayload: TokenPayloadType) {
        return await this.securityService.getUserDevices(userPayload.userId)
    }

    @Delete('devices')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteAllUserDevicesExceptTheCurrentOne(@CurrentUser() userPayload: TokenPayloadType): Promise<void> {
        return await this.securityService.deleteAllUserDevicesExceptTheCurrentOne(userPayload.userId, userPayload.deviceId);
    }

    @Delete('devices/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteUserDevice(@CurrentUser() userPayload: TokenPayloadType, @Param('id') deviceId: string): Promise<void | null> {
        return await this.securityService.deleteUserDeviceById(userPayload.userId, deviceId)
    }
}