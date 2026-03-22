import { Injectable } from '@nestjs/common';
import {PrismaService} from "../../../Database/prisma.service";
import {SortDirections} from "../../../Types/sortDirections.type";
import {PostPaginationQueryDto} from "../Validation/postQuery.validation";
import {NewestLikesType, PostOutputType, PostPaginated, PostSortFields} from "../Types/post.types";
import {LikeStatusFields} from "../../Comments/Types/comment.types";

@Injectable()
export class PostsQueryRepository {
    constructor(private prisma: PrismaService) {}

    async findAll(
        query: PostPaginationQueryDto,
        blogId?: string | null,
        currentUserId?: string | null
    ): Promise<PostPaginated> {
        const page = query.pageNumber ?? 1;
        const pageSize = query.pageSize ?? 10;
        const sortBy = query.sortBy ?? PostSortFields.createdAt;
        const sortDirection = query.sortDirection ?? SortDirections.DESC;

        const totalCount = await this.prisma.posts.count({
            where: blogId ? { blogId } : {},
        });
        const pagesCount = Math.ceil(totalCount / pageSize);

        const where = blogId ? { blogId } : {};

        const posts = await this.prisma.posts.findMany({
            skip: (page - 1) * pageSize,
            take: pageSize,
            orderBy: { [sortBy]: sortDirection },
            where,
        });

        // подтягиваем лайки для всех постов одним запросом
        const postIds = posts.map((p) => p.id);

        const likes = await this.prisma.likes.findMany({
            where: {
                entityId: { in: postIds },
                entityType: 'post',
            },
            include: {
                user: { select: { id: true, login: true } },
            },
            orderBy: { createdAt: 'desc' },
        });

        const items: PostOutputType[] = posts.map((post) => {
            const postLikes = likes.filter((l) => l.entityId === post.id);

            const likesCount = postLikes.filter((l) => l.status === 'Like').length;
            const dislikesCount = postLikes.filter((l) => l.status === 'Dislike').length;
            const myStatus =
                postLikes.find((l) => l.userId === currentUserId)?.status ??
                LikeStatusFields.None;

            const newestLikes: NewestLikesType[] = postLikes
                .filter((l) => l.status === 'Like')
                .slice(0, 3)
                .map((l) => ({
                    addedAt: l.createdAt,
                    userId: l.user.id,
                    login: l.user.login,
                }));

            return {
                ...post,
                extendedLikesInfo: {
                    likesCount,
                    dislikesCount,
                    myStatus: myStatus as LikeStatusFields,
                    newestLikes,
                },
            };
        });

        return {
            pagesCount,
            page,
            pageSize,
            totalCount,
            items,
        };
    }

    async findOne(id: string, currentUserId?: string | null): Promise<PostOutputType | null> {
        const post = await this.prisma.posts.findUnique({
            where: { id },
        });

        if (!post) return null;

        // подтягиваем все лайки для этого поста
        const likes = await this.prisma.likes.findMany({
            where: {
                entityId: id,
                entityType: 'post',
            },
            include: {
                user: { select: { id: true, login: true } },
            },
            orderBy: { createdAt: 'desc' },
        });

        const likesCount = likes.filter((l) => l.status === 'Like').length;
        const dislikesCount = likes.filter((l) => l.status === 'Dislike').length;
        const myStatus =
            likes.find((l) => l.userId === currentUserId)?.status ?? LikeStatusFields.None;

        const newestLikes: NewestLikesType[] = likes
            .filter((l) => l.status === 'Like')
            .slice(0, 3)
            .map((l) => ({
                addedAt: l.createdAt,
                userId: l.user.id,
                login: l.user.login,
            }));

        return {
            ...post,
            extendedLikesInfo: {
                likesCount,
                dislikesCount,
                myStatus: myStatus as LikeStatusFields,
                newestLikes,
            },
        };
    }
}