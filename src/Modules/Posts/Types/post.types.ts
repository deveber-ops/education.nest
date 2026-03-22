import { Posts } from '@prisma/client';
import {Paginator} from "../../../Types/paginated.type";
import {LikeStatusFields} from "../../Comments/Types/comment.types";

export enum PostSortFields {
    createdAt = 'createdAt',
}

export type NewestLikesType = {
    addedAt: Date,
    userId: string,
    login: string,
}

export type PostsLikes = {
    extendedLikesInfo: {
        likesCount: number,
        dislikesCount: number,
        myStatus: LikeStatusFields,
        newestLikes: NewestLikesType[]
    }
}

export type PostOutputType = Posts & PostsLikes

export type PostPaginated = Paginator<PostOutputType>;

export type PostInputType = {
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
}

export type PostCreateType = PostInputType & {
    blogName: string;
};

