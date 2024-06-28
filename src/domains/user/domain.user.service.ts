import { GetUsersRequest } from '@clv-factory/protobuf/dist/gRPC/generate/index.app.petshop.user.service.v1';
import { Injectable } from '@nestjs/common';

export const USER_TOKEN_SERVICE = 'USER MODULE USER_TOKEN_SERVICE';
@Injectable()
export class UserService {
  constructor() {}

  getUsers(payload: GetUsersRequest) {
    return 'ahihi do ngoc';
  }
}
