import { Module } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { PermissionController } from './permission.controller';
import { DiscoveryModule } from '@nestjs/core';
import { RoleModule } from 'src/role/role.module';

@Module({
    imports: [DiscoveryModule, RoleModule],
    controllers: [PermissionController],
    providers: [PermissionService],
    exports: [PermissionService]
})
export class PermissionModule { }
