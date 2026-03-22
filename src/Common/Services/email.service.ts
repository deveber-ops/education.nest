import {Injectable} from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import {ConfigService} from "@nestjs/config";

@Injectable()
export class EmailService {
    private transporter: nodemailer.Transporter;

    private readonly HOST: string;
    private readonly PORT: number;
    private readonly USER: string;
    private readonly PASSWORD: string;

    constructor(private configService: ConfigService) {
        this.HOST = this.configService.getOrThrow<string>('SMTP_HOST')
        this.PORT = Number(this.configService.getOrThrow<string>('SMTP_PORT'))
        this.USER = this.configService.getOrThrow<string>('SMTP_USER')
        this.PASSWORD = this.configService.getOrThrow<string>('SMTP_PASSWORD')
        this.transporter = nodemailer.createTransport({
            host: this.HOST,
            port: this.PORT,
            secure: true,
            auth: {
                user: this.USER,
                pass: this.PASSWORD,
            },
        });
    }

    async sendMail(to: string, subject: string, text: string, html?: string) {
        return await this.transporter.sendMail({
            from: `"No Reply" <${this.USER}>`,
            to,
            subject,
            text,
            html,
        });
    }
}