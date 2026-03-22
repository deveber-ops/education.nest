import { JwtPayload } from 'jsonwebtoken';

import 'express';
import {CurrentDeviceType} from "../Modules/Security/Types/security.types";

declare global {
    namespace Express {
        interface Request {
            currentUser: JwtPayload | null;
            currentDevice: CurrentDeviceType | null;
        }
    }
}

export {};