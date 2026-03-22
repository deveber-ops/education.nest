import {Injectable, Logger, UnauthorizedException} from '@nestjs/common';
import {Request, Response} from 'express';
import * as bcrypt from 'bcrypt';
import {UsersService} from "../../Users/Services/users.service";
import {CurrentDeviceType, RegisterDeviceType} from "../../Security/Types/security.types";
import {TokensService} from "../../Guards/Services/tokens.service";
import {SecurityService} from "../../Security/Services/security.service";
import {LoginValidation} from "../Validation/login.dto";

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private tokensService: TokensService,
        private securityService: SecurityService,
    ) {}

    async validateUser(loginOrEmail: string, password: string) {
        const user = await this.usersService.findByLoginOrEmail(loginOrEmail);
        if (user && await bcrypt.compare(password, user.password)) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(loginDto: LoginValidation, device: CurrentDeviceType, res: Response) {
        const userExpires = await this.validateUser(loginDto.loginOrEmail, loginDto.password);
        if (!userExpires) {
            throw new UnauthorizedException('Неверный логин или пароль');
        }

        const { accessToken, refreshToken } = await this.tokensService.generateTokens(userExpires.id, device.id);

        await this.securityService.registerDevice({
            ip: device.ip,
            deviceId: device.id,
            title: device.name,
            jti: refreshToken.payload.jti,
            expiresAt: new Date(refreshToken.payload.exp * 1000),
            lastActiveDate: new Date(),
            userId: userExpires.id
        })

        res.cookie('refreshToken', refreshToken.token, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: refreshToken.payload.exp * 1000,
        });

        return { accessToken: accessToken.token};
    }

    async refreshTokens(userId: string, device: CurrentDeviceType, res: Response) {
        const { accessToken, refreshToken } = await this.tokensService.generateTokens(userId, device.id);

        console.log('Генерация новых токенов')

        await this.securityService.registerDevice({
            ip: device.ip,
            deviceId: device.id,
            title: device.name,
            jti: refreshToken.payload.jti,
            expiresAt: new Date(refreshToken.payload.exp * 1000),
            lastActiveDate: new Date(),
            userId: userId
        })

        console.log('Генерация новых токенов завершена')

        res.cookie('refreshToken', refreshToken.token, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: refreshToken.payload.exp * 1000,
        });

        return { accessToken: accessToken.token};
    }
}