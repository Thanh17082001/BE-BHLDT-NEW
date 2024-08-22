import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Put,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dtos/create-role.dto';
import { UpdateRoleDto } from './dtos/update-role.dto';
import { Permission } from 'src/permission/permission.decorator';
import { ApiTags } from '@nestjs/swagger';
import { AddRolesToUser } from './dtos/add-roles-to-user.dto';
import { QueryRoleDto } from './dtos/query-role.dto';
import { PageOptionsDto } from 'src/utils/dtos/pageoptions-dto';
import { PageDto } from 'src/utils/dtos/page-dto';
import { RoleDto } from './dtos/role.dto';

@Controller('role')
@ApiTags('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) { }

  @Post()
  @Permission({
    name: 'ROLES_CREATE',
    description: 'API create new role',
  })
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }
  @Post('/add-roles-to-users')
  async addRolesToUser(@Body() body: AddRolesToUser) {
    console.log("createdsds", body);
    return this.roleService.addRolesToUser(body);
  }
  @Get()
  @Permission({
    name: 'ROLES_GET_ALL',
    description: 'API get all roles',
  })
  async findAllRoles(@Query() roleQuery: QueryRoleDto, @Query() pageOptionDto: PageOptionsDto): Promise<PageDto<RoleDto>> {
    return await this.roleService.find(roleQuery, pageOptionDto);
  }

  @Get(':id')
  @Permission({
    name: 'ROLES_GET_BY_ID',
    description: 'API get role by id',
  })
  findOne(@Param('id') id: string) {
    return this.roleService.findOne(+id);
  }

  @Put(':id')
  @Permission({
    name: 'ROLES_UPDATE',
    description: 'API update role by id',
  })
  async updateRole(@Param('id') id: number, @Body() updateRoleDto: UpdateRoleDto) {
    return await this.roleService.update(+id, updateRoleDto);
  }

  @Delete(':id')
  @Permission({
    name: 'ROLES_DELETE',
    description: 'API delete role by id',
  })
  remove(@Param('id') id: string) {
    return this.roleService.remove(+id);
  }
}
