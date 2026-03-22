import {Controller, Post, Body, Res, Get, UseGuards, HttpCode, HttpStatus, Req} from '@nestjs/common';
import {Request, Response} from 'express';
import {AuthService} from "../Services/auth.service";
import {LoginValidation} from "../Validation/login.dto";
import {BearerAuthGuard} from "../../Guards/Bearer/bearer-auth.guard";
import {CurrentUser} from "../../../Common/Decorators/currentUser.decorator";
import {UsersService} from "../../Users/Services/users.service";
import {TokenPayloadType} from "../Types/auth.types";
import {CurrentDevice} from "../../../Common/Decorators/currentDevice.declarator";
import {CurrentDeviceType} from "../../Security/Types/security.types";
import {RefreshTokenAuthGuard} from "../../Guards/Bearer/refreshToken-auth.guard";
import {SecurityService} from "../../Security/Services/security.service";
import {
    EmailInputDto,
    NewPasswordInputDto,
    UserInputDto
} from "../../Users/Validation/userInput.validation";
import {RegistrationService} from "../Services/registration.service";
import {RateLimiterGuard} from "../../Guards/Limiters/rateLimiter.guard";

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private usersService: UsersService,
        private securityService: SecurityService,
        private registrationService: RegistrationService,
    ) {}

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() dto: LoginValidation, @CurrentDevice() device: CurrentDeviceType, @Res() res: Response) {
        return res.json(await this.authService.login(dto, device, res));
    }

    @Get('me')
    @UseGuards(BearerAuthGuard)
    async getUserInfo(@CurrentUser() userPayload: TokenPayloadType, @Res() res: Response) {
        const user = await this.usersService.findOne(userPayload.userId);
        return res.json({
            email: user?.email,
            login: userPayload.login,
            userId: userPayload.userId
        });
    }

    @Post('refresh-token')
    @HttpCode(HttpStatus.OK)
    @UseGuards(RefreshTokenAuthGuard)
    async generateNewTokens(@CurrentUser() userPayload: TokenPayloadType, @CurrentDevice() device: CurrentDeviceType, @Res() res: Response) {
        return res.json(await this.authService.refreshTokens(userPayload.userId, device, res));
    }

    @Post('logout')
    @UseGuards(RefreshTokenAuthGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    async logout(@CurrentUser() userPayload: TokenPayloadType, @CurrentDevice() device: CurrentDeviceType) {
        return await this.securityService.deleteUserDeviceById(userPayload.userId ,device.id);
    }

    @Post('registration')
    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(RateLimiterGuard)
    async register(@Body() dto: UserInputDto) {
        return await this.registrationService.startNewRegistration(dto)
    }

    @Post('registration-email-resending')
    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(RateLimiterGuard)
    async registerResendEmail(@Body() dto: EmailInputDto) {
        return await this.registrationService.registerEmailResend(dto.email)
    }

    @Post('registration-confirmation')
    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(RateLimiterGuard)
    async registerConfirmation(@Body('code') code: string) {
        return await this.registrationService.registrationVerify(code)
    }

    @Post('password-recovery')
    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(RateLimiterGuard)
    async passwordRecovery(@Body() dto: EmailInputDto) {
        return await this.usersService.passwordRecovery(dto.email)
    }

    @Post('new-password')
    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(RateLimiterGuard)
    async newPassword(@Body() dto: NewPasswordInputDto) {
        return this.usersService.verifyPasswordRecovery(dto.recoveryCode, dto.newPassword)
    }
}