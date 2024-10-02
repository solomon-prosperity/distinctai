import { OnModuleInit, Inject } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { IOwnerServiceGrpcMethods } from 'src/common/utils/interfaces';

export class OwnersGrpcService implements OnModuleInit {
  private ownerGrpcService: IOwnerServiceGrpcMethods;
  constructor(@Inject('OWNERPROTO_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.ownerGrpcService =
      this.client.getService<IOwnerServiceGrpcMethods>('OwnerService');
  }

  async getOwner(owner_id: string) {
    const owner_response = await this.ownerGrpcService
      .getOwner({
        id: owner_id,
      })
      .toPromise();
    const owner = JSON.parse(owner_response.owner);
    return owner;
  }

  async validateToken(token: string) {
    const owner = await this.ownerGrpcService
      .validateToken({
        token,
      })
      .toPromise();
    return owner;
  }
}
