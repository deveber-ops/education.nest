export type UserInfoType = {
    email: string,
    login: string,
    userId: string,
}

export type TokenPayloadType = {
    jti: string,
    userId: string,
    deviceId: string,
    login: string,
    iat: number;
    exp: number;
}