import {ForbiddenException, Injectable, NotFoundException} from "@nestjs/common";
import {Comment, CommentCreateType, CommentPaginated} from "../Types/comment.types";
import {CommentsRepository} from "../Repositories/comments.repository";
import {PostsService} from "../../Posts/Services/posts.service";
import {CommentsQueryRepository} from "../Repositories/commentsQuery.repository";
import {CommentPaginationQueryDto} from "../Validation/commentQuery.validation";
import {TokenPayloadType} from "../../Auth/Types/auth.types";
import {CommentInputDto} from "../Validation/commentInput.validation";
import {LikesService} from "../../Likes/Services/likes.services";

@Injectable()
export class CommentsService {
    constructor(
        private readonly commentsRepository: CommentsRepository,
        private readonly commentsQueryRepository: CommentsQueryRepository,
        private readonly postsService: PostsService,
        private readonly likesService: LikesService,
    ) {
    }

    async create(data: CommentCreateType): Promise<Comment> {
        await this.postsService.findOne(data.postId);
        return await this.commentsRepository.create(data)
    }

    async findAllPostComments(query: CommentPaginationQueryDto, postId: string, userId: string | null): Promise<CommentPaginated> {
        return await this.commentsQueryRepository.findAllPostComments(query, postId, userId)
    }

    async findOne(id: string, userId: string | null): Promise<Comment> {
        const comment = await this.commentsQueryRepository.findOne(id, userId);
        if (!comment) {
            throw new NotFoundException({message: `Комментарий с указанным id: ${id} не найден.`, field: 'comment'});
        }
        return comment;
    }

    async update(user: TokenPayloadType, id: string, data: CommentInputDto): Promise<void | null> {
        const comment = await this.findOne(id, user.userId);

        if (user.userId !== comment.commentatorInfo.userId) {
            throw new ForbiddenException({message: 'Вы не можете редактировать чужой комментарий', field: 'comment'});
        }

        await this.commentsRepository.update(id, data)
    }

    async delete(user: TokenPayloadType, id: string): Promise<void | null> {
        const comment = await this.findOne(id, user.userId);

        if (user.userId !== comment.commentatorInfo.userId) {
            throw new ForbiddenException({message: 'Вы не можете удалить чужой комментарий', field: 'comment'});
        }

        await this.commentsRepository.delete(id)
    }

    async updateLikes(userId: string, commentId: string, status: string): Promise<void | null> {
        await this.findOne(commentId, userId)
        return await this.likesService.updateLikes(userId, commentId, status, 'comment')
    }
}