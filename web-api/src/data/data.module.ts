import { Module } from '@nestjs/common';
import { DataService } from './data.service';
import { DataController } from './data.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Role } from 'src/role/entities/role.entity';
import { UserModule } from 'src/user/user.module';
import { RoleModule } from 'src/role/role.module';
import { PermissionModule } from 'src/permission/permission.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Role]),
        UserModule,
        RoleModule,
        PermissionModule
    ],
    controllers: [DataController],
    providers: [DataService],
})
export class DataModule { }
