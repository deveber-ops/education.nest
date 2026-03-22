import {Injectable, NotFoundException} from '@nestjs/common';
import {Posts} from "@prisma/client";
import {PostsRepository} from "../Repositories/posts.repository";
import {PostsQueryRepository} from "../Repositories/postsQuery.repository";
import {PostCreateType, PostInputType} from "../Types/post.types";
import {PostPaginationQueryDto} from "../Validation/postQuery.validation";
import {BlogsService} from "../../Blogs/Services/blogs.service";
import {LikesService} from "../../Likes/Services/likes.services";

@Injectable()
export class PostsService {
    constructor(
        private queryRepo: PostsQueryRepository,
        private postsRepo: PostsRepository,
        private blogsService: BlogsService,
        private likesService: LikesService,
    ) {}

    async create(data: PostInputType): Promise<Posts | undefined> {
        const createPostData = data as PostCreateType
        const blog = await this.blogsService.findOne(data.blogId)
        if (blog) {
            createPostData.blogName = blog.name
            return this.postsRepo.create(createPostData);
        }
    }

    async findAll(query: PostPaginationQueryDto, blogId?: string | null, userId?: string | null): Promise<PostPaginationQueryDto> {
        return this.queryRepo.findAll(query, blogId, userId);
    }

    async findOne(id: string, userId?: string | null) {
        const post = await this.queryRepo.findOne(id, userId);
        if (!post) {
            throw new NotFoundException({message: `Пост с указанным id: ${id} не найден.`, field: 'post'});
        }
        return post;
    }

    async update(id: string, data: PostInputType): Promise<void | null> {
        const postUpdateData = data as PostCreateType
        const post = await this.queryRepo.findOne(id);
        const blog = await this.blogsService.findOne(data.blogId);
        if (!post) {
            throw new NotFoundException({message: `Пост с указанным id: ${id} не найден.`, field: 'post'});
        }

        if (!blog) {
            throw new NotFoundException({message: `Блог с указанным id: ${data.blogId} не найден.`, field: 'post'});
        }
        postUpdateData.blogName = blog.name;
        await this.postsRepo.update(id, postUpdateData);
    }

    async delete(id: string): Promise<void | object> {
        const post = await this.queryRepo.findOne(id);
        if (!post) {
            throw new NotFoundException({message: `Пост с указанным id: ${id} не найден.`, field: 'post'});
        }
        return this.postsRepo.delete(id);
    }

    async updateLikes(userId: string, postId: string, status: string): Promise<void | null> {
        await this.findOne(postId)
        return await this.likesService.updateLikes(userId, postId, status, 'post')
    }
}