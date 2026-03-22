import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {PrismaService} from "../Database/prisma.service";
import {BlogsController} from "../Modules/Blogs/Conntrollers/blogs.controller";
import {BlogsService} from "../Modules/Blogs/Services/blogs.service";
import {BlogsQueryRepository} from "../Modules/Blogs/Repositories/blogsQuery.repository";
import {BlogsRepository} from "../Modules/Blogs/Repositories/blogs.repository";
import {PostsService} from "../Modules/Posts/Services/posts.service";
import {PostsRepository} from "../Modules/Posts/Repositories/posts.repository";
import {PostsQueryRepository} from "../Modules/Posts/Repositories/postsQuery.repository";
import {PostsController} from "../Modules/Posts/Conntrollers/posts.controller";
import {UsersService} from "../Modules/Users/Services/users.service";
import {UsersController} from "../Modules/Users/Controllers/users.controller";
import {UsersRepository} from "../Modules/Users/Repositories/users.repository";
import {UsersQueryRepository} from "../Modules/Users/Repositories/usersQuery.repository";
import {ConfigService} from "@nestjs/config";
import {AuthController} from "../Modules/Auth/Controllers/auth.controller";
import {AuthService} from "../Modules/Auth/Services/auth.service";
import {JwtService} from "@nestjs/jwt";
import {CommentsService} from "../Modules/Comments/Services/comments.service";
import {CommentsRepository} from "../Modules/Comments/Repositories/comments.repository";
import {CommentsQueryRepository} from "../Modules/Comments/Repositories/commentsQuery.repository";
import {CommentsController} from "../Modules/Comments/Controllers/comments.controller";
import {DbCleanerService} from "../Common/Services/dbCleaner.service";
import {DeviceInfoMiddleware} from "../Common/Middlewares/device-info.middleware";
import {SecurityService} from "../Modules/Security/Services/security.service";
import {SecurityRepository} from "../Modules/Security/Repositories/security.repository";
import {SecurityQueryRepository} from "../Modules/Security/Repositories/securityQuery.repository";
import {SecurityController} from "../Modules/Security/Controllers/security.controller";
import {EmailService} from "../Common/Services/email.service";
import {TokensService} from "../Modules/Guards/Services/tokens.service";
import {RegistrationService} from "../Modules/Auth/Services/registration.service";
import {RegistrationRepository} from "../Modules/Auth/Repositories/registration.repository";
import {RegistrationQueryRepository} from "../Modules/Auth/Repositories/registrationQuery.repository";
import {OptionalJwtGuard} from "../Modules/Guards/Bearer/auth.guard";
import {APP_GUARD} from "@nestjs/core";
import {LikesService} from "../Modules/Likes/Services/likes.services";
import {LikesRepository} from "../Modules/Likes/Repositories/likes.repository";

@Module({
    imports: [],       // Подключаем другие модули
    controllers: [
        AppController,
        AuthController,
        BlogsController,
        PostsController,
        UsersController,
        CommentsController,
        SecurityController,
    ],  // Контроллеры верхнего уровня
    providers: [
        AppService,
        ConfigService,
        PrismaService,
        DbCleanerService,
        AuthService,
        RegistrationService,
        RegistrationRepository,
        RegistrationQueryRepository,
        JwtService,
        TokensService,
        EmailService,
        BlogsService,
        BlogsRepository,
        BlogsQueryRepository,
        PostsService,
        PostsRepository,
        PostsQueryRepository,
        UsersService,
        UsersRepository,
        UsersQueryRepository,
        CommentsService,
        CommentsRepository,
        CommentsQueryRepository,
        SecurityService,
        SecurityRepository,
        SecurityQueryRepository,
        LikesService,
        LikesRepository,
        {
            provide: APP_GUARD,
            useClass: OptionalJwtGuard,
        },
    ], // Сервисы и провайдеры
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(DeviceInfoMiddleware).forRoutes('*');
    }
}