import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dtos/create-role.dto';
import { UpdateRoleDto } from './dtos/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';
import { AddRolesToUser } from './dtos/add-roles-to-user.dto';
import { UserService } from 'src/user/user.service';
import { QueryRoleDto } from './dtos/query-role.dto';
import { PageOptionsDto } from 'src/utils/dtos/pageoptions-dto';
import { PageDto } from 'src/utils/dtos/page-dto';
import { RoleDto } from './dtos/role.dto';
import { PageMetaDto } from 'src/utils/dtos/pagemeta-dto';

@Injectable()
export class RoleService {

  constructor(@InjectRepository(Role) private roleRepo: Repository<Role>, private userService: UserService) { }

  async create(createRoleDto: CreateRoleDto) {
    const roleModel = {
      name: createRoleDto.name,
      description: createRoleDto.description,
      permissions: createRoleDto.permissions.toString()
    }

    const roleEntity = this.roleRepo.create(roleModel)
    const inserted_role = await this.roleRepo.save(roleEntity)
    return inserted_role;
  }
  async addRolesToUser(entity: AddRolesToUser) {
    let addListRole: Role[] = [];
    for (const roleId of entity.roles) {
      let findRole = await this.findOne(roleId);
      addListRole.push(findRole)
    }
    let user = await this.userService.findOne(entity.userId);
    user.roles = addListRole;
    return this.userService.save(user);
  }
  async find(roleQuery: QueryRoleDto, pageOptionsDto: PageOptionsDto): Promise<PageDto<RoleDto>> {
    const queryBuilder = this.roleRepo.createQueryBuilder("role");
    if (roleQuery.name) {
      let nameQuery = roleQuery.name;
      console.log("name query ", nameQuery);
      queryBuilder.where("role.name = :name", { name: nameQuery });
    }

    console.log("pageOptionsDto.skip", pageOptionsDto.skip);
    console.log("pageOptionsDto.take", pageOptionsDto.take);

    await queryBuilder.orderBy("role.createdAt", pageOptionsDto.order).skip(pageOptionsDto.skip).take(pageOptionsDto.take);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({ pageOptionsDto, itemCount });

    console.log("find all roles - entities 22", entities);
    console.log("find all roles - itemCount", itemCount);

    return new PageDto(entities, pageMetaDto);
  }

  findOne(id: number) {
    return this.roleRepo.findOne({
      where: {
        id: id
      }
    });
  }

  async update(id: number, attrs: UpdateRoleDto) {
    const role = await this.findOne(id);
    if (!role) {
      throw new NotFoundException('role not found');
    }
    console.log('id', id);
    console.log('role_id', attrs.id);

    if (attrs.id !== id) {
      throw new NotFoundException('role not found');
    }
    const checkExist = await this.findOneByRolename(attrs.name);
    if (checkExist && checkExist.id !== role.id) {
      throw new BadRequestException('Role is Already Registered');
    }
    Object.assign(role, attrs);
    console.log("last", role);

    return this.roleRepo.save(role);
  }
  findOneByRolename(name: string) {
    return this.roleRepo.findOne({
      where: {
        name: name
      }
    });
  }
  async remove(id: number) {
    const role = await this.roleRepo.findOne({
      where: {
        id
      }
    })

    if (!role) {
      throw new NotFoundException(`Not found role has id ${id}`)
    }
    role.status = 0
    await this.roleRepo.save(role)
    return role;
  }

  async getRoleById(id: number) {
    const role = await this.roleRepo.findOne({
      where: {
        id
      }
    })
    if (!role) {
      throw new NotFoundException(`Not found role id: ${id}`)
    }
    return role;
  }
}
