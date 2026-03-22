import {CanActivate, ExecutionContext, Injectable} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {Request} from 'express';
import {ConfigService} from "@nestjs/config";

@Injectable()
export class OptionalJwtGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) {}

    canActivate(context: ExecutionContext): boolean {
        const req: Request = context.switchToHttp().getRequest();
        const authHeader = req.headers['authorization'];

        if (authHeader) {
            const token = authHeader.split(' ')[1];
            try {
                req.currentUser = this.jwtService.verify(token, {
                    secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
                });
            } catch (e) {

            }
        } else {

        }

        return true;
    }
}