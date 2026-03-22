import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    Put,
    Query,
    UseGuards
} from '@nestjs/common';
import { PostsService } from '../Services/posts.service';
import {Posts} from "@prisma/client";
import {idValidation} from "../../../Common/Validation/id.validation";
import {PostPaginationQueryDto} from "../Validation/postQuery.validation";
import {PostBlogIdValidation} from "../Validation/postInput.validation";
import {CommentsService} from "../../Comments/Services/comments.service";
import {Comment, CommentCreateType, CommentPaginated} from "../../Comments/Types/comment.types";
import {CurrentUser} from "../../../Common/Decorators/currentUser.decorator";
import {TokenPayloadType} from "../../Auth/Types/auth.types";
import {BearerAuthGuard} from "../../Guards/Bearer/bearer-auth.guard";
import {CommentInputDto} from "../../Comments/Validation/commentInput.validation";
import {CommentPaginationQueryDto} from "../../Comments/Validation/commentQuery.validation";
import {BasicAuthGuard} from "../../Guards/Basic/basic-auth.guard";
import {OptionalJwtGuard} from "../../Guards/Bearer/auth.guard";
import {LikeInputDto} from "../../Comments/Validation/likeInput.validation";

@Controller('posts')
export class PostsController {
    constructor(
        private readonly postsService: PostsService,
        private readonly commentsService: CommentsService,
    ) {}

    @Get()
    @UseGuards(OptionalJwtGuard)
    async getPosts(
        @Query() query: PostPaginationQueryDto,
        @CurrentUser() user: { userId: string, login: string } | null,
    ): Promise<PostPaginationQueryDto> {
        const userId = user?.userId ?? null
        return this.postsService.findAll(query, null, userId);
    }

    @Get(':id')
    @UseGuards(OptionalJwtGuard)
    async getPost(
        @Param() params: idValidation,
        @CurrentUser() user: { userId: string, login: string } | null,
    ): Promise<Posts | null> {
        const userId = user?.userId ?? null
        return this.postsService.findOne(params.id, userId);
    }

    @Get(':id/comments')
    @UseGuards(OptionalJwtGuard)
    async getPostComments(
        @Param() params: idValidation,
        @Query() query: CommentPaginationQueryDto,
        @CurrentUser() user: { userId: string, login: string } | null
    ): Promise<CommentPaginated | null> {
        const userid = user?.userId ?? null
        return this.commentsService.findAllPostComments(query, params.id, userid);
    }

    @Post()
    @UseGuards(BasicAuthGuard)
    async createPost(@Body() data: PostBlogIdValidation): Promise<Posts | undefined> {
        return this.postsService.create(data);
    }

    @Post(':id/comments')
    @UseGuards(BearerAuthGuard)
    async createComment(@CurrentUser() userPayload: TokenPayloadType, @Param() params: idValidation, @Body() data: CommentInputDto): Promise<Comment> {
        const createCommentData = data as CommentCreateType;
        createCommentData.postId = params.id
        createCommentData.userId = userPayload.userId

        return await this.commentsService.create(createCommentData)
    }

    @Put(':id')
    @UseGuards(BasicAuthGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    async updatePost(
        @Param() params: idValidation,
        @Body() data: PostBlogIdValidation,
    ): Promise<void | null> {
        return this.postsService.update(params.id, data);
    }

    @Put(':id/like-status')
    @UseGuards(BearerAuthGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    async updateLikes(@CurrentUser() userPayload: TokenPayloadType, @Param() params: idValidation, @Body() data: LikeInputDto): Promise<void | null> {
        return await this.postsService.updateLikes(userPayload.userId, params.id, data.likeStatus)
    }

    @Delete(':id')
    @UseGuards(BasicAuthGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    async deletePost(@Param() params: idValidation): Promise<void | object> {
        return this.postsService.delete(params.id);
    }
}