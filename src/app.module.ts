import { Module } from '@nestjs/common';
import { RepositoriesModule } from './infrastructure/postgresql/repositories.module';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import rootConfiguration from './infrastructure/configuration';
import { RoleModule } from './domains/role/domain.role.module';
import { CustomerOrderModule } from './domains/customerorder/domain.customerorder.module';
import { CustomerOrderDetailModule } from './domains/customerorderdetail/domain.customerorderdetail.module';
import { LineModule } from './domains/line/domain.line.module';
import { CustomerModule } from './domains/customer/domain.customer.module';
import { PDAHistModule } from './domains/pdahist/domain.pdahist.module';
import { InboundModule } from './domains/inbound/domain.inbound.module';
import { OutboundModule } from './domains/outbound/domain.outbound.module';
import { OutboundDetailModule } from './domains/outbounddetail/domain.outbounddetail.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [join(process.cwd(), 'env', `.env`)],
      load: [rootConfiguration],
    }),
    RepositoriesModule.forRoot({
      database: rootConfiguration().DB_NAME,
      host: rootConfiguration().DB_HOST,
      port: rootConfiguration().DB_PORT,
      username: rootConfiguration().DB_USERNAME,
      password: rootConfiguration().DB_PASSWORD,
    }),
    RoleModule,
    CustomerOrderModule,
    CustomerOrderDetailModule,
    LineModule,
    CustomerModule,
    PDAHistModule,
    InboundModule,
    OutboundModule,
    OutboundDetailModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
