import {BadRequestException, Injectable} from "@nestjs/common";
import {RegistrationRepository} from "../Repositories/registration.repository";
import {UserInputDto} from "../../Users/Validation/userInput.validation";
import {EmailService} from "../../../Common/Services/email.service";
import * as bcrypt from "bcrypt";
import {Prisma, Registrations} from "@prisma/client";
import {ConfigService} from "@nestjs/config";
import {RegistrationQueryRepository} from "../Repositories/registrationQuery.repository";
import {v4 as uuidv4} from "uuid";
import {UsersRepository} from "../../Users/Repositories/users.repository";
import {UsersQueryRepository} from "../../Users/Repositories/usersQuery.repository";

@Injectable()
export class RegistrationService {
    private readonly confirmationExp: number

    constructor(
        private registrationRepository: RegistrationRepository,
        private registrationQueryRepository: RegistrationQueryRepository,
        private emailService: EmailService,
        private configService: ConfigService,
        private usersRepository: UsersRepository,
        private usersQueryRepository: UsersQueryRepository,
    ) {
        this.confirmationExp = Number(this.configService.getOrThrow<number>('CONFIRMATION_CODE_EXPIRES_MINUTES'))
    }

    private buildConfirmationHtml(code: string): string {
        return `
          <h1>Добро пожаловать в BLOGGERS PLATFORM!</h1>
          <a href='https://edu.deveber.site/registration-confirmation?code=${code}'>Подтвердить регистрацию</a>
          <p>Или введите его вручную. Код подтверждения: ${code}</p>
          <p>Код действителен в течение ${this.confirmationExp} минут.</p>
        `;
    }

    async startNewRegistration(data: UserInputDto) {
        const salt = await bcrypt.genSalt(10);
        data.password = await bcrypt.hash(data.password, salt);

        const existingUserLogin = await this.usersQueryRepository.findByLoginOrEmail(data.login)
        const existingUserEmail = await this.usersQueryRepository.findByLoginOrEmail(data.email)

        if (existingUserLogin) {
            throw new BadRequestException({message: `Пользователь с таким login: ${data.login} уже существует.`, field: 'login'});
        }

        if (existingUserEmail) {
            throw new BadRequestException({message: `Пользователь с таким email: ${data.email} уже существует.`, field: 'email'});
        }

        try {
            const { password, ...registerUser } = await this.registrationRepository.setNewRegistration(data) as Registrations;
            await this.emailService.sendMail(data.email, 'Код подтверждения регистрации', '', this.buildConfirmationHtml(registerUser.verificationCode))
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    const fields =
                        (error.meta as any)?.driverAdapterError?.cause?.constraint?.fields as string[] | undefined;

                    if (fields && fields.length > 0) {
                        throw new BadRequestException({message: `Пользователь с таким ${fields[0]} уже существует.`, field: fields[0]});
                    }
                }
            }
            throw error;
        }
    }

    async registerEmailResend(email: string) {
        const newVerificationCode = uuidv4()
        const newCodeExpires = new Date(Date.now() + this.confirmationExp * 60 * 1000)
        const registration = await this.registrationQueryRepository.getRegistrationByEmailOrCode(email);

        if (!registration) {
            throw new BadRequestException({message: `Пользователь с таким email: ${email} не найден.`, field: 'email'});
        }

        await this.registrationRepository.updateRegistration(email, newVerificationCode, newCodeExpires)
        await this.emailService.sendMail(email, 'Код подтверждения регистрации', '', this.buildConfirmationHtml(newVerificationCode))
    }

    async registrationVerify(code: string): Promise<void | object> {
        const registration = await this.registrationQueryRepository.getRegistrationByEmailOrCode(code);

        if (!registration) {
            throw new BadRequestException({message: `Код подтверждения просрочен или недействителен.`, field: 'code'});
        }

        const userData = {
            login: registration.login,
            email: registration.email,
            password: registration.password
        }

        await this.usersRepository.create(userData)
        await this.deleteRegistration(registration.id)
    }

    async deleteRegistration(id: string): Promise<void> {
        await this.registrationRepository.deleteRegistration(id);
    }
}