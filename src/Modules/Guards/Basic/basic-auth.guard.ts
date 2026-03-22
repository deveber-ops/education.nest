import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import {ConfigService} from "@nestjs/config";

@Injectable()
export class BasicAuthGuard implements CanActivate {
    constructor(private configService: ConfigService) {
    }
    canActivate(context: ExecutionContext): boolean {
        const req = context.switchToHttp().getRequest();
        const authHeader = req.headers['authorization'];
        if (!authHeader || !authHeader.startsWith('Basic ')) {
            throw new UnauthorizedException('Не найден Basic Auth заголовок.');
        }
        const base64Credentials = authHeader.split(' ')[1];
        const [username, password] = Buffer.from(base64Credentials, 'base64')
            .toString('ascii')
            .split(':');

        const superAdminLogin = this.configService.getOrThrow<string>('ADMIN_LOGIN')!;
        const superAdminPassword = this.configService.getOrThrow<string>('ADMIN_PASSWORD')!;

        if (username === superAdminLogin && password === superAdminPassword) {
            return true;
        }

        throw new UnauthorizedException('Логин или пароль не верны.');
    }
}