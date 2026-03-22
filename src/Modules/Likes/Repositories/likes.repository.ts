import {Injectable} from "@nestjs/common";
import {PrismaService} from "../../../Database/prisma.service";
import {Likes} from "@prisma/client"

@Injectable()
export class LikesRepository {
    constructor(private readonly prisma: PrismaService) {}

    async findLike(userId: string, entityId: string, entityType: string): Promise<Likes | null> {
        return this.prisma.likes.findUnique({
            where: {
                userId_entityId_entityType: { userId, entityId, entityType },
            },
        });
    }

    async updateLike(userId: string, entityId: string, status: string, entityType: string): Promise<Likes> {
        return this.prisma.likes.update({
            where: {
                userId_entityId_entityType: { userId, entityId, entityType },
            },
            data: { status },
        });
    }

    async createLike(
        userId: string,
        entityId: string,
        status: string,
        entityType: string
    ): Promise<Likes> {
        return this.prisma.likes.create({
            data: {
                userId,
                entityId,
                status,
                entityType,
            },
        });
    }
}