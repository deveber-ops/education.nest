import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import {SecurityService} from "../../Security/Services/security.service";
import {TokenPayloadType} from "../../Auth/Types/auth.types";

@Injectable()
export class RefreshTokenAuthGuard implements CanActivate {
    constructor(
        private configService: ConfigService,
        private jwtService: JwtService,
        private securityService: SecurityService
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest<Request>();
        const refreshToken = req.cookies['refreshToken'];

        if (!refreshToken) {
            throw new UnauthorizedException('Refresh token не найден.');
        }

        try {
            const payload = this.jwtService.verify<TokenPayloadType>(refreshToken, {
                ignoreExpiration: true,
                secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
            });
            console.log('Старт проверки токена')
            await this.securityService.verifyDeviceToken(payload);
            console.log('Токен действителен')
            req.currentUser = payload;
            return true;
        } catch (err) {
            throw err
        }
    }
}