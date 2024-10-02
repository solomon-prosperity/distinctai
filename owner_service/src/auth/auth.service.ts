import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { SigninDto } from './dto/signin-dto';
import { SignupDto } from './dto/signup-dto';
import { RabbitmqService } from 'src/rabbitmq/rabbitmq.service';
import { OwnersService } from 'src/owners/owners.service';
import runInTransaction from 'src/common/utils/runInTransaction';
import { Owner } from 'src/owners/interfaces/owner.interface';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { IJwtPayload } from './interfaces/auth.interfaces';

@Injectable()
export class AuthService {
  constructor(
    private readonly ownersService: OwnersService,
    private readonly rabitmqService: RabbitmqService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signUp(payload: SignupDto): Promise<Owner> {
    try {
      const response = await runInTransaction(async (session) => {
        const { email, password } = payload;
        const owner = await this.ownersService.findOne({
          email,
        });
        if (owner)
          throw new ConflictException(
            'An Owner already exists with this email',
          );
        const hashed_password = await bcrypt.hash(password, 10);
        payload.password = hashed_password;
        const new_owner = await this.ownersService.create(payload, session);
        return new_owner;
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  async signIn(payload: SigninDto) {
    try {
      const { email, password } = payload;
      const user = await this.ownersService.findOne({
        email,
      });
      if (!user) throw new UnauthorizedException('Invalid credentials');
      const match = await bcrypt.compare(password, user.password as string);
      if (!match) throw new UnauthorizedException('Invalid credentials');

      const token = this.jwtService.sign({
        user_id: user.id,
        env: this.configService.get('NODE_ENV'),
        iat: Math.floor(new Date().getTime() / 1000),
      });
      const data = user?.toJSON();
      return { user: data, token };
    } catch (error) {
      throw error;
    }
  }

  async validateToken(token: string) {
    try {
      const secret = this.configService.get('JWT_SECRET');
      const valid: IJwtPayload = this.jwtService.verify(token, { secret });
      if (!valid) throw new UnauthorizedException('Invalid credentials');
      const { user_id, env } = valid;
      if (env !== this.configService.get('NODE_ENV')) {
        throw new UnauthorizedException(
          `You cannot use ${env} tokens for ${this.configService.get('NODE_ENV')} environment`,
        );
      }
      const user = await this.ownersService.findOne({
        _id: user_id,
      });
      if (!user) throw new UnauthorizedException('Invalid credentials');
      return user;
    } catch (error) {
      throw error;
    }
  }
}
