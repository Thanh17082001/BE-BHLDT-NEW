import { Controller, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { Public, User } from 'src/decorators/customize.decorator';
import { Permission, SkipPermission } from 'src/permission/permission.decorator';
import { IUser, TokenPayload } from 'src/utils/UserInterface';
import { ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
  ) { }


  @Post('login')
  @UseGuards(LocalAuthGuard) //check user name & password in Database
  @Permission({ name: "AUTH_LOGIN", description: "API login" })
  @Public()
  @SkipPermission()
  async handleLogin(@User() user: IUser) { // if exists account, return that user
    return await this.authService.login(user) //logic login (sign)
  }

  @Post('renewAccessToken')
  @Permission({ name: "AUTH_RENEW_TOKEN", description: "API renew access token" })
  @Public()
  renewAccessToken(@Body('refresh_token') refreshToken: string) {
    return this.authService.renewAccessToken(refreshToken)
  }

  @Post('logout')
  @Permission({ name: "AUTH_LOGOUT", description: "API logout" })
  logout(@User() user: IUser) {
    return this.authService.removeRefreshToken(user.id)
  }
}
