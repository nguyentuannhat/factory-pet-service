import { Module } from '@nestjs/common';
import { ROLE_TOKEN_SERVICE, RoleService } from './domain.role.service';
import { RoleController } from './domain.role.controller';

@Module({
  imports: [],
  controllers: [RoleController],
  providers: [
    {
      provide: ROLE_TOKEN_SERVICE,
      useClass: RoleService,
    },
  ],
  exports: [ROLE_TOKEN_SERVICE],
})
export class RoleModule {}
