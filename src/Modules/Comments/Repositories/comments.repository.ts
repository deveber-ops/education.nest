import {Injectable} from "@nestjs/common";
import {PrismaService} from "../../../Database/prisma.service";
import {Comment, CommentCreateType, CommentInputType, LikeStatusFields} from "../Types/comment.types";

@Injectable()
export class CommentsRepository {
    constructor(private prisma: PrismaService) {}

    async create(data: CommentCreateType): Promise<Comment> {
        const createdComment = await this.prisma.comments.create({
            data,
            include: {
                user: {
                    select: {
                        id: true,
                        login: true,
                    },
                },
            },
        });

        return {
            id: createdComment.id,
            content: createdComment.content,
            createdAt: createdComment.createdAt,
            commentatorInfo: {
                userId: createdComment.user.id,
                userLogin: createdComment.user.login,
            },
            likesInfo: {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: LikeStatusFields.None
            }
        };
    }

    async update(id: string, data: CommentInputType): Promise<void | object> {
        return this.prisma.comments.update({ where: { id }, data });
    }

    async delete(id: string): Promise<void | object> {
        return this.prisma.comments.delete({ where: { id } });
    }
}