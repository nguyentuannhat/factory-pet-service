import { AppDataSource } from '../infrastructure/postgresql/datasource/index';
import { CustomerOrderDetailSync1713507961355 } from '../infrastructure/postgresql/migrations/1713507961355-CustomerOrderDetailSync';

AppDataSource.initialize().then(async () => {
  const migrationInstance = new CustomerOrderDetailSync1713507961355();
  const queryRunner = await AppDataSource.createQueryRunner();
  queryRunner.connect();
  queryRunner.startTransaction();

  try {
    await migrationInstance.up(queryRunner);
    await queryRunner.commitTransaction();
  } catch (err) {
    await queryRunner.rollbackTransaction();
    throw err;
  } finally {
    // Release the query runner which is manually instantiated
    await queryRunner.release();
  }

  console.log('Migration run successfully');
  await AppDataSource.destroy();
});
