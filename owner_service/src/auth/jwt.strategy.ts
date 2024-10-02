import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { OwnersService } from 'src/owners/owners.service';
import { ConfigService } from '@nestjs/config';
import { IJwtPayload } from './interfaces/auth.interfaces';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly ownersService: OwnersService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: IJwtPayload) {
    const { user_id, env } = payload;
    if (env !== this.configService.get('NODE_ENV')) {
      throw new UnauthorizedException(
        `You cannot use ${env} tokens for ${this.configService.get('NODE_ENV')} environment`,
      );
    }
    const user = await this.ownersService.findOne({ _id: user_id });
    if (!user) throw new UnauthorizedException('Invalid Token');
    return user;
  }
}
