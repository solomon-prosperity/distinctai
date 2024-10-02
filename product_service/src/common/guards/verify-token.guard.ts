import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { OwnersGrpcService } from '../services/owners-grpc-client.service';

@Injectable()
export class VerifyTokenGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService,
    private readonly ownersGrpcService: OwnersGrpcService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest<Request>();
      const { headers } = request;
      const jwt_token =
        headers.authorization && headers.authorization.split('Bearer ')[1];
      if (!jwt_token) {
        throw new UnauthorizedException('Unauthorized');
      }
      const user_response =
        await this.ownersGrpcService.validateToken(jwt_token);
      if (!jwt_token || !user_response) {
        throw new UnauthorizedException('Unauthorized');
      }
      const user = JSON.parse(user_response.owner);
      request.user = user!;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Unauthorized');
      // throw error;
    }
  }
}
