import {Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UseGuards} from '@nestjs/common';
import { BlogsService } from '../Services/blogs.service';
import {BlogPaginationQueryDto} from "../Validation/blogQuery.validation";
import {BlogInputDto} from "../Validation/blogInput.validation";
import {Blogs, Posts} from "@prisma/client";
import {idValidation} from "../../../Common/Validation/id.validation";
import {PostPaginationQueryDto} from "../../Posts/Validation/postQuery.validation";
import {PostsService} from "../../Posts/Services/posts.service";
import {PostBlogIdValidation, PostInputDto} from "../../Posts/Validation/postInput.validation";
import {BasicAuthGuard} from "../../Guards/Basic/basic-auth.guard";
import {OptionalJwtGuard} from "../../Guards/Bearer/auth.guard";
import {CurrentUser} from "../../../Common/Decorators/currentUser.decorator";

@Controller('blogs')
export class BlogsController {
    constructor(
        private readonly blogsService: BlogsService,
        private readonly postsService: PostsService
    ) {}

    @Get()
    async getBlogs(
        @Query() query: BlogPaginationQueryDto,
    ): Promise<BlogPaginationQueryDto> {
        return this.blogsService.findAll(query);
    }

    @Get(':id')
    async getBlog(@Param() params: idValidation): Promise<Blogs | null> {
        return this.blogsService.findOne(params.id);
    }

    @Get(':id/posts')
    @UseGuards(OptionalJwtGuard)
    async getBlogPosts(
        @Param() params: idValidation,
        @Query() query: PostPaginationQueryDto,
        @CurrentUser() user: { userId: string, login: string } | null
    ): Promise<PostPaginationQueryDto> {
        const userId = user?.userId ?? null
        return this.postsService.findAll(query, params.id, userId);
    }

    @Post()
    @UseGuards(BasicAuthGuard)
    async createBlog(@Body() data: BlogInputDto): Promise<Blogs> {
        return this.blogsService.create(data);
    }

    @Post(':id/posts')
    @UseGuards(BasicAuthGuard)
    async createPostInBlog(@Param() params: idValidation, @Body() data: PostInputDto): Promise<Posts | undefined> {
        const createPostData = data as PostBlogIdValidation
        const blog = await this.blogsService.findOne(params.id);
        if (blog) {
            createPostData.blogId = params.id
            return this.postsService.create(createPostData);
        }
    }

    @Put(':id')
    @UseGuards(BasicAuthGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    async updateBlog(
        @Param() params: idValidation,
        @Body() data: BlogInputDto,
    ): Promise<void | null> {
        return this.blogsService.update(params.id, data);
    }

    @Delete(':id')
    @UseGuards(BasicAuthGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteBlog(@Param() params: idValidation): Promise<void | object> {
        return this.blogsService.delete(params.id);
    }
}