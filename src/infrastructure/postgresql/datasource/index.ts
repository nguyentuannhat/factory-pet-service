import { DataSource } from 'typeorm';

import { SnakeNamingStrategy } from './naming.strategy';

export const AppDataSource = new DataSource({
  entities: [__dirname + '/../entities/*{.ts,.js}'],
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  migrationsRun: false,
  logging: false,
  namingStrategy: new SnakeNamingStrategy(),
  migrationsTableName: 'migrations_table',
  migrationsTransactionMode: 'each',
  synchronize: false,
});
