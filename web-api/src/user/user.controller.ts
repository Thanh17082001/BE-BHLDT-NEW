import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  UseInterceptors,
  ClassSerializerInterceptor,
  Request,
  UnauthorizedException,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { QueryUserDto } from './dtos/query-user.dto';
import { PageOptionsDto } from 'src/utils/dtos/pageoptions-dto';
import { PageDto } from 'src/utils/dtos/page-dto';
import { Public, User } from 'src/decorators/customize.decorator';
import { Permission, SkipPermission } from 'src/permission/permission.decorator';
import { IUser, TokenPayload } from 'src/utils/UserInterface';
import { ApiTags } from '@nestjs/swagger';

@Controller('user')
@ApiTags('user')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
 @Permission({ name: "USERS_CREATE", description: "API create new user" })
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  // @Get()
  // async findAllUsers(@Query() userQuery:QueryUserDto, @Query() pageOptionDto: PageOptionsDto): Promise<PageDto<UserDto>> {
  //   return await this.userService.find(userQuery, pageOptionDto);
  // }

  @Get()
  @Permission({ name: "USERS_GET_ALL", description: "API get all users" })
  @Public()
  @SkipPermission()
  async findAllUsers() {
    return await this.userService.getAllUsers();
  }

  @Get('me')
  @Permission({ name: "USERS_GET_ME", description: "API get my information" })
  async findUser(@User() reqUser: IUser) {
    const user = await this.userService.findOne(reqUser.id);
    return user;
  }

  @Get(':id')
  @Permission({ name: "USERS_GET_BY_ID", description: "API get user by id" })
  async findUserById(@Param('id') id: string) {
    const user = await this.userService.findOne(+id);
    return user;
  }

  @Patch(':id')
  @Permission({ name: "USERS_UPDATE", description: "API update user by id" })
  async updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return await this.userService.update(+id, body);
  }

  @Delete(':id')
  @Permission({ name: "USERS_DELETE", description: "API delete user by id" })
  removeUser(@Param('id') id: string) {
    return this.userService.softDelete(+id);
  }

}
