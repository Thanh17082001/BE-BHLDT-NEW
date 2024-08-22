import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { RoleService } from 'src/role/role.service';
import { isEmptyString } from 'src/utils/StringUtil';
import { IUser, TokenPayload } from 'src/utils/UserInterface';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(
        private authService: AuthService,
        private roleService: RoleService
    ) {
        super();
    }

    async validate(username: string, password: string): Promise<any> {
        const user = await this.authService.validateUser(username, password);
        if (!user) {
            throw new UnauthorizedException('Your email or password is incorrect');
        }
        const role = await this.roleService.getRoleById(user.role_id)
        const permissions = role.permissions.split(',')
        const payloadUser: IUser = {
            id: user.id,
            uuid: user.uuid,
            email: user.email,
            username: user.username,
            role: role.name,
            permissions: (permissions.length == 1 && isEmptyString(permissions[0])) ? [] : permissions
        }
        return payloadUser;
    }
}