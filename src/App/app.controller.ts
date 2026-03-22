import {Controller, Delete, Get, HttpCode, HttpStatus} from '@nestjs/common';
import { AppService } from './app.service';
import {DbCleanerService} from "../Common/Services/dbCleaner.service";
import {PrismaService} from "../Database/prisma.service";
import {CurrentDevice} from "../Common/Decorators/currentDevice.declarator";

@Controller()
export class AppController {
    constructor(
        private readonly appService: AppService,
        private readonly clearDBService: DbCleanerService,
        private readonly prisma: PrismaService,
    ) {}

    @Get()
    getHello(): string {
        return this.appService.getHello();
    }

    @Delete('testing/all-data')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteAllDataInDB(): Promise<void> {
        await this.clearDBService.clear(this.prisma.blogs)
        await this.clearDBService.clear(this.prisma.posts)
        await this.clearDBService.clear(this.prisma.comments)
        await this.clearDBService.clear(this.prisma.users)
        await this.clearDBService.clear(this.prisma.devices)
        await this.clearDBService.clear(this.prisma.registrations)
    }

    @Get('device-info')
    async getDevice(@CurrentDevice() device: any) {
        return device;
    }
}