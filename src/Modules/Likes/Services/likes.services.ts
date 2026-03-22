import {Injectable, NotFoundException} from "@nestjs/common";
import {LikesRepository} from "../Repositories/likes.repository";
import {UsersService} from "../../Users/Services/users.service";

@Injectable()
export class LikesService {
    constructor(
        private readonly likesRepo: LikesRepository,
        private readonly usersService: UsersService
    ) {}

    async updateLikes(
        userId: string,
        entityId: string,
        status: string,
        entityType: string
    ): Promise<void | null> {
        const existingUser = await this.usersService.findOne(userId);

        if (!existingUser) {
            throw new NotFoundException({message: `Пользователь с указанным id: ${userId} не найден.`, field: 'userId'});
        }

        const existingLike = await this.likesRepo.findLike(userId, entityId, entityType);

        if (existingLike && existingLike.status === status) {
            return null;
        }

        if (existingLike) {
            await this.likesRepo.updateLike(userId, entityId, status, entityType);
            return;
        }

        await this.likesRepo.createLike(userId, entityId, status, entityType);
    }
}