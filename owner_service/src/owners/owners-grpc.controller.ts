import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { OwnersService } from 'src/owners/owners.service';
import { AuthService } from 'src/auth/auth.service';

@Controller('ownersgrpc')
export class OwnersGrpcController {
  constructor(
    private readonly ownersService: OwnersService,
    private readonly authService: AuthService,
  ) {}

  @GrpcMethod('OwnerService', 'getOwner')
  async getOwner(data: { id: string }) {
    const { id } = data;
    const owner_response = await this.ownersService.getOwner(id);
    const owner = JSON.stringify(owner_response);
    return { owner };
  }

  @GrpcMethod('OwnerService', 'validateToken')
  async validateToken(data: { token: string }) {
    const { token } = data;
    const owner_response = await this.authService.validateToken(token);
    const owner = JSON.stringify(owner_response);
    return { owner };
  }
}
