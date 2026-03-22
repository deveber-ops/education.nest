import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import useragent from 'useragent';
import crypto from 'crypto';

function generateFingerprint(req: Request) {
    const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '';
    const agent = useragent.parse(req.headers['user-agent'] || '');
    const raw = `${agent.toString()}-${ip}-${req.headers['accept-language'] || ''}`;
    return crypto.createHash('sha256').update(raw).digest('hex');
}

@Injectable()
export class DeviceInfoMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';
        const agent = useragent.parse(req.headers['user-agent'] || '');

        req.currentDevice = {
            id: generateFingerprint(req),
            ip,
            name: agent.toString() || 'Unknown Device',
            type: agent.device.toString() || 'Generic',
            os: agent.os.toString() || 'Unknown OS',
        };

        next();
    }
}