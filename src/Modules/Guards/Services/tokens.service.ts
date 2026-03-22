import {Injectable} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import {ConfigService} from "@nestjs/config";
import {v4 as uuidv4} from "uuid";
import {UsersService} from "../../Users/Services/users.service";
import {JwtPayload} from "jsonwebtoken";
import {TokenPayloadType} from "../../Auth/Types/auth.types";

interface Tokens {
    accessToken: {
        token: string;
        payload: TokenPayloadType
    };
    refreshToken: {
        token: string;
        payload: TokenPayloadType
    };
}

@Injectable()
export class TokensService {
    private readonly accessSecret: string
    private readonly accessExp: number
    private readonly refreshSecret: string
    private readonly refreshExp: number

    private readonly tokenPayload = { userId: '', login: '', jti: '', deviceId: '' }

    constructor(
        private jwtService: JwtService,
        private configService: ConfigService,
        private usersService: UsersService,
    ) {
        this.accessSecret = this.configService.getOrThrow<string>('JWT_ACCESS_SECRET');
        this.accessExp = Number(this.configService.get<number>('ACCESS_TOKEN_EXPIRES_SECONDS')) || 86400;
        this.refreshSecret = this.configService.getOrThrow<string>('JWT_REFRESH_SECRET');
        this.refreshExp = Number(this.configService.get<number>('REFRESH_TOKEN_EXPIRES_SECONDS')) || 604800;
    }

    async generateTokens(userId: string, deviceId: string): Promise<Tokens> {
        const user = await this.usersService.findOne(userId);
        if (user) {
            this.tokenPayload.userId = userId;
            this.tokenPayload.deviceId = deviceId;
            this.tokenPayload.login = user.login;
            this.tokenPayload.jti = uuidv4()
        }

        const accessToken = this.jwtService.sign(this.tokenPayload, {
            expiresIn: this.accessExp,
            secret: this.accessSecret
        });

        const refreshToken = this.jwtService.sign(this.tokenPayload, {
            expiresIn: this.refreshExp,
            secret: this.refreshSecret
        });

        const decodedAccess = this.jwtService.decode(accessToken) as any;
        const decodedRefresh = this.jwtService.decode(refreshToken) as any;

        return {
            accessToken: {
                token: accessToken,
                payload: {
                    ...this.tokenPayload,
                    iat: decodedAccess.iat,
                    exp: decodedAccess.exp,
                }
            },
            refreshToken: {
                token: refreshToken,
                payload: {
                    ...this.tokenPayload,
                    iat: decodedRefresh.iat,
                    exp: decodedRefresh.exp,
                }
            },
        };
    }
}