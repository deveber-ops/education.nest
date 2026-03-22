import {Paginator} from "../../../Types/paginated.type";

export enum CommentSortFields {
    createdAt = 'createdAt'
}

export enum LikeStatusFields {
    None = 'None',
    Like = 'Like',
    Dislike = 'Dislike'
}

export type Comment = {
    id: string
    content: string
    createdAt: Date
    commentatorInfo: {
        userId: string
        userLogin: string
    },
    "likesInfo": {
        "likesCount": Number,
        "dislikesCount": Number,
        "myStatus": LikeStatusFields
    }
}

export type CommentPaginated = Paginator<Comment>

export type CommentInputType = {
    content: string
}

export type CommentCreateType = CommentInputType & {
    postId: string
    userId: string
}