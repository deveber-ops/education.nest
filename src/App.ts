import { NestFactory } from '@nestjs/core';
import {BadRequestException, ValidationPipe} from '@nestjs/common';
import { AppModule } from "./App/app.module";
import * as dotenv from 'dotenv';
import {AllExceptionsFilter} from "./Common/Filters/exceptions.filter";
import cookieParser from "cookie-parser";
dotenv.config();

async function startApp() {
    const app = await NestFactory.create(AppModule);
    app.use(cookieParser());

    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        exceptionFactory: (errors) => {
            const formattedErrors = errors.map((error) => {
                const constraints = error.constraints || {};
                const messages = Object.values(constraints);
                const message = messages.reverse()[0];
                return {
                    message,
                    field: error.property,
                };
            });
            return new BadRequestException({ errorsMessages: formattedErrors });
        },
    }));

    app.useGlobalFilters(new AllExceptionsFilter());

    await app.listen(process.env.PORT || 3000);
    console.log(`🚀 Application is running on: http://localhost:${process.env.PORT || 3000}`);
}

startApp();