import {Injectable, NotFoundException} from '@nestjs/common';
import {BlogsQueryRepository} from "../Repositories/blogsQuery.repository";
import {BlogInputType} from "../Types/blog.types";
import {BlogPaginationQueryDto} from "../Validation/blogQuery.validation";
import {Blogs} from "@prisma/client";
import {BlogsRepository} from "../Repositories/blogs.repository";

@Injectable()
export class BlogsService {
    constructor(
        private queryRepo: BlogsQueryRepository,
        private blogsRepo: BlogsRepository
    ) {}

    async create(data: BlogInputType): Promise<Blogs> {
        return this.blogsRepo.create(data);
    }

    async findAll(query: BlogPaginationQueryDto): Promise<BlogPaginationQueryDto> {
        return this.queryRepo.findAll(query);
    }

    async findOne(id: string) {
        const blog = await this.queryRepo.findOne(id);
        if (!blog) {
            throw new NotFoundException({message: `Блог с указанным id: ${id} не найден.`, field: 'blog'});
        }
        return blog;
    }

    async update(id: string, data: BlogInputType): Promise<void | null> {
        const blog = await this.queryRepo.findOne(id);
        if (!blog) {
            throw new NotFoundException({message: `Блог с указанным id: ${id} не найден.`, field: 'blog'});
        }
        await this.blogsRepo.update(id, data);
    }

    async delete(id: string): Promise<void | object> {
        const blog = await this.queryRepo.findOne(id);
        if (!blog) {
            throw new NotFoundException({message: `Блог с указанным id: ${id} не найден.`, field: 'blog'});
        }
        return this.blogsRepo.delete(id);
    }
}