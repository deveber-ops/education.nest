import {Injectable} from "@nestjs/common";
import {PrismaService} from "../../../Database/prisma.service";
import {SortDirections} from "../../../Types/sortDirections.type";
import {Users} from "@prisma/client";
import {UserOutputType, UserPaginated, UserSortFields} from "../Types/user.types";
import {UserPaginationQueryDto} from "../Validation/userQuery.validation";

@Injectable()
export class UsersQueryRepository {
    constructor(
        private prisma: PrismaService
    ) {}

    async findAll(query: UserPaginationQueryDto): Promise<UserPaginated> {
        const page = query.pageNumber ?? 1;
        const pageSize = query.pageSize ?? 10;
        const sortBy = query.sortBy ?? UserSortFields.createdAt;
        const sortDirection = query.sortDirection ?? SortDirections.DESC;

        const totalCount = await this.prisma.users.count();
        const pagesCount = Math.ceil(totalCount / pageSize);

        const where: any = {};

        if (query.searchEmailTerm || query.searchLoginTerm) {
            where.OR = [];

            if (query.searchEmailTerm) {
                where.OR.push({
                    email: {
                        contains: query.searchEmailTerm,
                        mode: 'insensitive',
                    },
                });
            }

            if (query.searchLoginTerm) {
                where.OR.push({
                    login: {
                        contains: query.searchLoginTerm,
                        mode: 'insensitive',
                    },
                });
            }
        }

        const items: UserOutputType[] = await this.prisma.users.findMany({
            skip: (page - 1) * pageSize,
            take: pageSize,
            orderBy: { [sortBy]: sortDirection },
            where,
            select: {
                id: true,
                createdAt: true,
                email: true,
                login: true,
            },
        });

        return {
            pagesCount,
            page,
            pageSize,
            totalCount,
            items,
        };
    }

    async findOne(id: string): Promise<Users | null> {
        return await this.prisma.users.findUnique({ where: { id } });
    }

    async findByLoginOrEmail(loginOrEmail: string): Promise<Users | null> {
        return await this.prisma.users.findFirst({
            where: {
                OR: [
                    { login: loginOrEmail },
                    { email: loginOrEmail },
                ],
            },
        });
    }

    async findByRecoveryCode(recoveryCode: string): Promise<Users | null> {
        return await this.prisma.users.findFirst({ where: { recoveryCode } })
    }
}