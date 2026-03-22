import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from '@nestjs/common';
import {JwtService} from "@nestjs/jwt";
import {ConfigService} from "@nestjs/config";
import {Request} from "express";
import {TokenPayloadType} from "../../Auth/Types/auth.types";

@Injectable()
export class BearerAuthGuard implements CanActivate {
    constructor(
        private configService: ConfigService,
        private jwtService: JwtService
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest<Request>();
        const authHeader = req.headers['authorization'];
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedException('Не найден Bearer Auth заголовок.');
        }
        const token = authHeader.split(' ')[1];
        try {
            req.currentUser = await this.jwtService.verifyAsync<TokenPayloadType>(token, {
                secret: this.configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
            });

            return true;
        } catch {
            throw new UnauthorizedException('Токен авторизации недействителен.');
        }
    }
}