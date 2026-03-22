import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let errorsMessages: { message: string; field: string | undefined }[] = [];

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const exceptionResponse: any = exception.getResponse();

            if (exceptionResponse?.errorsMessages) {
                // Если это уже наш формат из ValidationPipe
                errorsMessages = exceptionResponse.errorsMessages;
            } else {
                // Любая другая ошибка Nest
                errorsMessages = [
                    {
                        message:
                            typeof exceptionResponse === 'string'
                                ? exceptionResponse
                                : exceptionResponse?.message || 'Unexpected error',
                        field: exceptionResponse.field || undefined,
                    },
                ];
            }
        } else if (exception instanceof Error) {
            errorsMessages = [
                {
                    message: exception.message,
                    field: undefined,
                },
            ];
        }

        response.status(status).json({ errorsMessages });
    }
}