import { Injectable } from '@nestjs/common';
import {PrismaService} from "../../../Database/prisma.service";
import {SortDirections} from "../../../Types/sortDirections.type";
import {BlogPaginated, BlogSortFields} from "../Types/blog.types";
import {BlogPaginationQueryDto} from "../Validation/blogQuery.validation";
import {Blogs} from "@prisma/client";

@Injectable()
export class BlogsQueryRepository {
    constructor(private prisma: PrismaService) {}

    async findAll(query: BlogPaginationQueryDto): Promise<BlogPaginated> {
        const page = query.pageNumber ?? 1;
        const pageSize = query.pageSize ?? 10;
        const sortBy = query.sortBy ?? BlogSortFields.createdAt;
        const sortDirection = query.sortDirection ?? SortDirections.DESC;

        const totalCount = await this.prisma.blogs.count();
        const pagesCount = Math.ceil(totalCount / pageSize);

        const items: Blogs[] = await this.prisma.blogs.findMany({
            skip: (page - 1) * pageSize,
            take: pageSize,
            orderBy: { [sortBy]: sortDirection },
        });

        return {
            pagesCount,
            page,
            pageSize,
            totalCount,
            items,
        };
    }

    async findOne(id: string) {
        return this.prisma.blogs.findUnique({ where: { id } });
    }
}