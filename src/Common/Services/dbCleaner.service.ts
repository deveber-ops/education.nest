import {Injectable} from "@nestjs/common";
import {PrismaService} from "../../Database/prisma.service";

@Injectable()
export class DbCleanerService {
    constructor(private prisma: PrismaService) {}

    async clear(model: { deleteMany: (args?: any) => Promise<any> }): Promise<void> {
        await model.deleteMany();
    }
}