import {Injectable} from "@nestjs/common";
import {PrismaService} from "../../../Database/prisma.service";
import {Comment, CommentPaginated, CommentSortFields, LikeStatusFields} from "../Types/comment.types";
import {SortDirections} from "../../../Types/sortDirections.type";
import {CommentPaginationQueryDto} from "../Validation/commentQuery.validation";

@Injectable()
export class CommentsQueryRepository {
    constructor(private prisma: PrismaService) {}

    async findAllPostComments(
        query: CommentPaginationQueryDto,
        postId: string,
        currentUserId: string | null
    ): Promise<CommentPaginated> {
        const page = query.pageNumber ?? 1;
        const pageSize = query.pageSize ?? 10;
        const sortBy = query.sortBy ?? CommentSortFields.createdAt;
        const sortDirection = query.sortDirection ?? SortDirections.DESC;

        const totalCount = await this.prisma.comments.count({
            where: { postId }
        });
        const pagesCount = Math.ceil(totalCount / pageSize);

        const comments = await this.prisma.comments.findMany({
            skip: (page - 1) * pageSize,
            take: pageSize,
            orderBy: { [sortBy]: sortDirection },
            where: { postId },
            include: {
                user: { select: { id: true, login: true } },
            },
        });

        const items: Comment[] = await Promise.all(
            comments.map(async (c) => {
                const likes = await this.prisma.likes.findMany({
                    where: {
                        entityId: c.id,
                        entityType: 'comment',
                    },
                    select: { userId: true, status: true },
                });

                const likesCount = likes.filter(l => l.status === 'Like').length;
                const dislikesCount = likes.filter(l => l.status === 'Dislike').length;
                const myStatus = likes.find(l => l.userId === currentUserId)?.status ?? LikeStatusFields.None;

                return {
                    id: c.id,
                    content: c.content,
                    createdAt: c.createdAt,
                    commentatorInfo: {
                        userId: c.user.id,
                        userLogin: c.user.login,
                    },
                    likesInfo: {
                        likesCount,
                        dislikesCount,
                        myStatus: myStatus as LikeStatusFields,
                    },
                };
            })
        );

        return {
            pagesCount,
            page,
            pageSize,
            totalCount,
            items,
        };
    }

    async findOne(id: string, currentUserId: string | null): Promise<Comment | null> {
        const comment = await this.prisma.comments.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        login: true,
                    },
                },
            },
        });

        if (!comment) return null;

        // отдельный запрос к лайкам
        const likes = await this.prisma.likes.findMany({
            where: {
                entityId: id,
                entityType: 'comment',
            },
            select: {
                userId: true,
                status: true,
            },
        });

        const likesCount = likes.filter(l => l.status === 'Like').length;
        const dislikesCount = likes.filter(l => l.status === 'Dislike').length;
        const myStatus =
            likes.find(l => l.userId === currentUserId)?.status ?? LikeStatusFields.None;

        return {
            id: comment.id,
            content: comment.content,
            createdAt: comment.createdAt,
            commentatorInfo: {
                userId: comment.user.id,
                userLogin: comment.user.login,
            },
            likesInfo: {
                likesCount,
                dislikesCount,
                myStatus: myStatus as LikeStatusFields,
            },
        };
    }
}