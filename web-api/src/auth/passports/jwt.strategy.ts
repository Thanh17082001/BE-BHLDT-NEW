import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TokenPayload } from 'src/utils/UserInterface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private configService: ConfigService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_ACCESS_SECRET') ?? 'JWT_ACCESS_SECRET_!@#$%',
        });
    }

    async validate(payload: TokenPayload) {
        const newPayload = { ...payload, author: "Khoi Nguyen" }
        return payload.user
    }
}