import {Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Query, UseGuards} from "@nestjs/common";
import { UserOutputType,
    UserPaginated
} from "../Types/user.types";
import {UsersService} from "../Services/users.service";
import {UserPaginationQueryDto} from "../Validation/userQuery.validation";
import {idValidation} from "../../../Common/Validation/id.validation";
import {BasicAuthGuard} from "../../Guards/Basic/basic-auth.guard";
import {UserInputDto} from "../Validation/userInput.validation";

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    @UseGuards(BasicAuthGuard)
    async findAll(@Query() query: UserPaginationQueryDto): Promise<UserPaginated> {
        return this.usersService.findAll(query);
    }

    @Post()
    @UseGuards(BasicAuthGuard)
    async createUser(
        @Body() data: UserInputDto
    ): Promise<UserOutputType> {
        return this.usersService.create(data);
    }

    @Delete(':id')
    @UseGuards(BasicAuthGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    async delete(@Param() params: idValidation): Promise<void | object> {
        return await this.usersService.delete(params.id)
    }
}