import {Devices} from "@prisma/client";

export type SecurityDeviceOutputType = Omit<
    Devices,
    'jti' | 'createdAt' | 'expiresAt' | 'userId'
>;

export type RegisterDeviceType = Omit<Devices, 'createdAt'>;

export type UpdateDeviceType = Omit<Devices, 'deviceId' | 'ip' | 'title' | 'createdAt'>;

export type CurrentDeviceType = {
    id: string;
    ip: string;
    name: string;
    type: string;
    os?: string;
}