import { Controller, Get, Inject, Post } from '@nestjs/common';
import { ROLE_TOKEN_SERVICE, RoleService } from './domain.role.service';
import {
  CreateRoleRequest,
  RoleServiceController,
  RoleServiceControllerMethods,
} from '@clv-factory/protobuf/dist/gRPC/generate/index.app.payment.role.service.v1';

@Controller('role')
@RoleServiceControllerMethods()
export class RoleController implements RoleServiceController {
  constructor(@Inject(ROLE_TOKEN_SERVICE) private roleService: RoleService) {}

  @Get('/v1')
  async getRoles() {
    console.log(
      '🚀🚀🚀 file: role.controller.ts [line 15] call method getRoles',
    );
    return {
      roles: await this.roleService.get(),
    };
  }

  @Post('/v1')
  async createRole(request: CreateRoleRequest) {
    const result = await this.roleService.create(request);
    return result;
  }
}
