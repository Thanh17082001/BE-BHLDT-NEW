import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSION_KEY, PermissionType, SKIP_PERMISSION } from './permission.decorator';
import { IUser } from 'src/utils/UserInterface';

@Injectable()
export class PermissionGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const permission: PermissionType = this.reflector.get(
            PERMISSION_KEY,
            context.getHandler(),
        );
        if (!permission) {
            return true;
        }

        const isSkipPermission = this.reflector.getAllAndOverride<boolean>(SKIP_PERMISSION, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isSkipPermission) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const user: IUser = request.user;
        if (!user) {
            throw new UnauthorizedException('Not found user, please login');
        }

        if (user.permissions.includes(permission.name)) {
            return true;
        }
        return false;
    }
}
