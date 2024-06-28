import { Module } from '@nestjs/common';
import { UserController } from './domain.user.controller';
import { USER_TOKEN_SERVICE, UserService } from './domain.user.service';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [
    {
      provide: USER_TOKEN_SERVICE,
      useClass: UserService,
    },
  ],
  exports: [USER_TOKEN_SERVICE],
})
export class UserModule {}
