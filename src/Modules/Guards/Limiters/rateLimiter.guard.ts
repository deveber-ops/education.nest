import {
    Injectable,
    CanActivate,
    ExecutionContext,
    HttpException, HttpStatus,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class RateLimiterGuard implements CanActivate {
    private readonly windowMs = 10000;
    private readonly maxRequests = 5;
    private readonly requests = new Map<string, number[]>();

    canActivate(context: ExecutionContext): boolean {
        const req = context.switchToHttp().getRequest<Request>();
        const ip = req.ip;
        const endpoint = req.path;
        const key = `${ip}:${endpoint}`;
        const now = Date.now();

        const timestamps = this.requests.get(key) || [];
        const recent = timestamps.filter(ts => now - ts < this.windowMs);

        if (recent.length >= this.maxRequests) {
            throw new HttpException(
                `Превышен лимит ${this.maxRequests} запросов за ${this.windowMs / 1000} секунд для ${endpoint}`,
                HttpStatus.TOO_MANY_REQUESTS,
            );
        }

        recent.push(now);
        this.requests.set(key, recent);

        return true;
    }
}