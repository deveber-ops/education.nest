import { Blogs } from '@prisma/client';
import {Paginator} from "../../../Types/paginated.type";

export enum BlogSortFields {
    createdAt = 'createdAt',
}

export type BlogPaginated = Paginator<Blogs>;

export type BlogInputType = {
    name: string;
    description: string;
    websiteUrl: string;
}