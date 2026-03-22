import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Put,
    UseGuards
} from "@nestjs/common";
import {CommentsService} from "../Services/comments.service";
import {idValidation} from "../../../Common/Validation/id.validation";
import {Comment} from "../Types/comment.types";
import {BearerAuthGuard} from "../../Guards/Bearer/bearer-auth.guard";
import {CurrentUser} from "../../../Common/Decorators/currentUser.decorator";
import {TokenPayloadType} from "../../Auth/Types/auth.types";
import {CommentInputDto} from "../Validation/commentInput.validation";
import {LikeInputDto} from "../Validation/likeInput.validation";
import {OptionalJwtGuard} from "../../Guards/Bearer/auth.guard";

@Controller('comments')

export class CommentsController {
    constructor(
        private readonly commentsService: CommentsService,
    ) {}

    @Get(':id')
    @UseGuards(OptionalJwtGuard)
    async findOne(@Param() params: idValidation, @CurrentUser() user: { userId: string, login: string } | null): Promise<Comment> {
        const userid = user?.userId ?? null
        return await this.commentsService.findOne(params.id, userid);
    }

    @Put(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(BearerAuthGuard)
    async update(@CurrentUser() userPayload: TokenPayloadType, @Param() params: idValidation, @Body() data: CommentInputDto): Promise<void | null> {
        return await this.commentsService.update(userPayload, params.id, data)
    }

    @Put(':id/like-status')
    @UseGuards(BearerAuthGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    async updateLikes(@CurrentUser() userPayload: TokenPayloadType, @Param() params: idValidation, @Body() data: LikeInputDto): Promise<void | null> {
        return await this.commentsService.updateLikes(userPayload.userId, params.id, data.likeStatus)
    }

    @Delete(':id')
    @UseGuards(BearerAuthGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    async delete(@CurrentUser() userPayload: TokenPayloadType, @Param() params: idValidation): Promise<void | null> {
        return await this.commentsService.delete(userPayload, params.id);
    }
}