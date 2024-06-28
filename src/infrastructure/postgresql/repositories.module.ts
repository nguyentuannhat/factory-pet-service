import { DynamicModule, Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PostgresConnectionCredentialsOptions } from 'typeorm/driver/postgres/PostgresConnectionCredentialsOptions';
import entities from './entities';
import { SnakeNamingStrategy } from './datasource/naming.strategy';

import {
  I_ROLE_REPOSITORY,
  RoleRepository,
} from './repositories/role.repository';
import {
  I_CUSTOMERORDERDETAIL_REPOSITORY,
  CustomerOrderDetailRepository,
} from './repositories/customerOrderDetail.repository';
import {
  I_LINE_REPOSITORY,
  LineRepository,
} from './repositories/line.repository';
import {
  CustomerRepository,
  I_CUSTOMER_REPOSITORY,
} from './repositories/customer.repository';
import {
  I_PDA_HIST_REPOSITORY,
  PDAHistRepository,
} from './repositories/pdahis.repository';
import {
  I_INBOUND_REPOSITORY,
  InboundRepository,
} from './repositories/inbound.repository';
import {
  I_OUTBOUND_REPOSITORY,
  OutboundRepository,
} from './repositories/outbound.repository';
import {
  I_OUTBOUND_DETAIL_REPOSITORY,
  OutboundDetailRepository,
} from './repositories/outboundDetail.repository';

@Global()
@Module({})
export class RepositoriesModule {
  static forRoot(options: PostgresConnectionCredentialsOptions): DynamicModule {
    return {
      imports: [
        TypeOrmModule.forRootAsync({
          useFactory: () => ({
            type: 'postgres',
            database: options.database,
            host: options.host,
            port: options.port,
            username: options.username,
            password: options.password,
            synchronize: false, // not recommended on production
            logging: true,
            entities: entities,
            autoLoadEntities: false,
            namingStrategy: new SnakeNamingStrategy(),
            migrations: [__dirname + '/migrations/*{.ts,.js}'],
            migrationsRun: false,
            migrationsTransactionMode: 'each',
            migrationsTableName: 'migrations_table',
          }),
        }),
        TypeOrmModule.forFeature(entities),
      ],
      providers: [
        {
          provide: I_ROLE_REPOSITORY,
          useClass: RoleRepository,
        },
        {
          provide: I_CUSTOMERORDERDETAIL_REPOSITORY,
          useClass: CustomerOrderDetailRepository,
        },
        {
          provide: I_LINE_REPOSITORY,
          useClass: LineRepository,
        },
        {
          provide: I_CUSTOMER_REPOSITORY,
          useClass: CustomerRepository,
        },
        {
          provide: I_PDA_HIST_REPOSITORY,
          useClass: PDAHistRepository,
        },
        {
          provide: I_INBOUND_REPOSITORY,
          useClass: InboundRepository,
        },
        {
          provide: I_OUTBOUND_REPOSITORY,
          useClass: OutboundRepository,
        },
        {
          provide: I_OUTBOUND_DETAIL_REPOSITORY,
          useClass: OutboundDetailRepository,
        },
      ],
      exports: [
        I_ROLE_REPOSITORY,
        I_CUSTOMERORDERDETAIL_REPOSITORY,
        I_LINE_REPOSITORY,
        I_CUSTOMER_REPOSITORY,
        I_PDA_HIST_REPOSITORY,
        I_INBOUND_REPOSITORY,
        I_OUTBOUND_REPOSITORY,
        I_OUTBOUND_DETAIL_REPOSITORY,
      ],
      module: RepositoriesModule,
    };
  }
}
