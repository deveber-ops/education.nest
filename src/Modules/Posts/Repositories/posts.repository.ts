import {Injectable} from "@nestjs/common";
import {PrismaService} from "../../../Database/prisma.service";
import {PostCreateType, PostInputType, PostOutputType} from "../Types/post.types";
import {LikeStatusFields} from "../../Comments/Types/comment.types";

@Injectable()
export class PostsRepository {
    constructor(
        private prisma: PrismaService
    ) {}

    async create(data: PostCreateType): Promise<PostOutputType> {
        const createdPost = await this.prisma.posts.create({ data });

        return {
            ...createdPost,
            extendedLikesInfo: {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: LikeStatusFields.None,
                newestLikes: [],
            },
        };
    }

    async update(id: string, data: PostInputType) {
        return this.prisma.posts.update({ where: { id }, data });
    }

    async delete(id: string): Promise<void | object> {
        return this.prisma.posts.delete({ where: { id } });
    }
}