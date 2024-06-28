import {
  GetUsersRequest,
  GetUsersResponse,
  UserServiceController,
  UserServiceControllerMethods,
} from '@clv-factory/protobuf/dist/gRPC/generate/index.app.petshop.user.service.v1';
import { Controller, Get, Inject } from '@nestjs/common';
import { USER_TOKEN_SERVICE, UserService } from './domain.user.service';

@Controller('petshop')
@UserServiceControllerMethods()
export class UserController implements UserServiceController {
  constructor(
    @Inject(USER_TOKEN_SERVICE)
    private userService: UserService,
  ) {}

  @Get('/v1')
  async getUsers(payload: GetUsersRequest): Promise<GetUsersResponse> {
    const result = await this.userService.getUsers(payload);
    throw new Error('Method not implemented.');
  }
}
