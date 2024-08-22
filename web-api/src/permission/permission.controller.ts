import { Controller, Get } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { Public } from 'src/decorators/customize.decorator';
import { Permission, SkipPermission } from './permission.decorator';
import { RoleService } from 'src/role/role.service';

@Controller('permission')
export class PermissionController {
    constructor(
        private readonly permissionsService: PermissionService,
        private readonly rolesService: RoleService
    ) { }

    @Get()
    @Public()
    @SkipPermission()
    @Permission({ name: "PERMISSIONS_GET_ALL", description: "API get all permissions" })
    async getAllRoles() {
        return await this.permissionsService.getAllpermission();

    }
}
