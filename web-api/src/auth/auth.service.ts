import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { IUser, TokenPayload } from 'src/utils/UserInterface';
import { UserUtil } from 'src/utils/UserUtil';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshToken } from './entities/refresh.token.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
    private userService: UserService,
    @InjectRepository(RefreshToken)
    private refreshTokenRepo: Repository<RefreshToken>,
  ) { }

  async validateUser(username: string, password: string) {
    const user = await this.userService.findOneByEmail(username);
    if (user) {
      if (UserUtil.isValidPassword(password, user.password)) {
        return user;
      }
    }
    return null;
  }

  async login(user: IUser) {
    const payload: TokenPayload = {
      sub: 'Access Token',
      iss: 'From Server',
      user,
    };
    const access_token = this.jwtService.sign(payload);
    const refresh_token = this.signRefreshToken(payload);

    const updatedResult = await this.refreshTokenRepo.update(
      {
        user_id: user.id,
      },
      {
        refresh_token: refresh_token,
      },
    );

    if (updatedResult.affected == 0) {
      const decoded_refresh_token = this.verifyToken(refresh_token);

      const refresh_token_entity = {
        user_id: user.id,
        refresh_token: refresh_token,
        expired_in: new Date(decoded_refresh_token.exp * 1000),
      };

      const refreshTokenEntity =
        this.refreshTokenRepo.create(refresh_token_entity);
      const insertedRToken =
        await this.refreshTokenRepo.save(refreshTokenEntity);
    }

    return {
      access_token,
      refresh_token,
      user: {
        uuid: user.uuid,
        email: user.email,
        role: user.role,
        permissions: user.permissions,
      },
    };
  }

  signRefreshToken(payload: TokenPayload) {
    const newPayload = { ...payload, sub: 'Refresh Token' };
    const refresh_token: string = this.jwtService.sign(newPayload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRED'),
    });
    return refresh_token;
  }

  renewAccessToken(refreshToken: string) {
    const decoded = this.verifyToken(refreshToken);
    const newPayload: TokenPayload = {
      sub: 'Access Token',
      iss: 'From Server',
      user: decoded.user
    };
    const access_token = this.jwtService.sign(newPayload);
    return {
      access_token,
    };
  }

  verifyToken(refresh_token: string) {
    try {
      return this.jwtService.verify(refresh_token);
    } catch (error) {
      throw new UnauthorizedException('Access Token is Invalid');
    }
  }

  async removeRefreshToken(user_id: number) {
    const refreshToken = await this.refreshTokenRepo.findOne({
      where: {
        user_id,
      },
    });

    if (!refreshToken) {
      throw new NotFoundException('Not found refresh token');
    }

    const removedRToken = await this.refreshTokenRepo.remove(refreshToken);
    return {
      message: 'DELETED REFRESH TOKEN',
      removedRToken,
    };
  }
}
