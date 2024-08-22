import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/role/entities/role.entity';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { sample_roles, sample_users } from './sample';
import { CreateUserDto } from 'src/user/dtos/create-user.dto';
import { UserService } from 'src/user/user.service';
import { RoleService } from 'src/role/role.service';
import { CreateRoleDto } from 'src/role/dtos/create-role.dto';
import { PermissionService } from 'src/permission/permission.service';

@Injectable()
export class DataService implements OnModuleInit {
    private readonly logger = new Logger(DataService.name);
    constructor(
        private configService: ConfigService,
        private userService: UserService,
        private permissionsService: PermissionService,
        private roleService: RoleService,
        @InjectRepository(User) private userRepo: Repository<User>,
        @InjectRepository(Role) private roleRepo: Repository<Role>,
    ) { }

    async onModuleInit() {
        const willLoad = this.configService.get<string>('INIT_DATA');
        if (willLoad === 'true') {
            this.logger.log('Start loading data ... ');

            const [user_count, role_count, permissions] = await Promise.all([
                this.userRepo.count(),
                this.roleRepo.count(),
                this.permissionsService.getAllpermission()
            ]);
            if (user_count == 0) {
                this.logger.log('Loading users data ... ');

                await Promise.all(
                    sample_users.map(async (createUserDto: CreateUserDto) => {
                        await this.userService.create(createUserDto);
                    }),
                );
            }

            if (role_count == 0) {
                this.logger.log('Loading roles data ... ');
                let adminRole: string[] = [];
                let userRole: string[] = [];

                permissions.forEach((p) => {
                    adminRole.push(p.permission.name);
                    if (
                        p.permission.name.includes('GET') ||
                        p.permission.name.includes('AUTH')
                    ) {
                        userRole.push(p.permission.name);
                    }
                });
                sample_roles[0] = { ...sample_roles[0], permissions: adminRole }
                sample_roles[1] = { ...sample_roles[1], permissions: userRole }
                await Promise.all(
                    sample_roles.map(async (createRoleDto: CreateRoleDto) => {
                        await this.roleService.create(createRoleDto);
                    }),
                );
            }
        }
    }
}
