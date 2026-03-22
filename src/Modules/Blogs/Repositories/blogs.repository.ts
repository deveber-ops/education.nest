import {Injectable} from "@nestjs/common";
import {PrismaService} from "../../../Database/prisma.service";
import {Blogs} from "@prisma/client";
import {BlogInputType} from "../Types/blog.types";

@Injectable()
export class BlogsRepository {
    constructor(private prisma: PrismaService) {}

    create(data: BlogInputType): Promise<Blogs>  {
        return this.prisma.blogs.create({ data });
    }

    update(id: string, data: BlogInputType) {
        return this.prisma.blogs.update({ where: { id }, data });
    }

    delete(id: string): Promise<void | object> {
        return this.prisma.blogs.delete({ where: { id } });
    }
}