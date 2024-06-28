import { MigrationInterface, QueryRunner } from 'typeorm';

export class CustomerOrderDetailSync1713507961355
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    WITH upsert AS (
      UPDATE mes_cust_ord_dtl
      SET co_cd = mrp_cust_ord_dtl.co_cd, ord_no = mrp_cust_ord_dtl.ord_no, sku_id = mrp_cust_ord_dtl.sku_id,
      ord_qty = mrp_cust_ord_dtl.qty_no, shp_dt = mrp_cust_ord_dtl.de_dt,
      ut_price = mrp_cust_ord_dtl.ut_price, amt = mrp_cust_ord_dtl.ttl_amt
      FROM mrp_cust_ord_dtl
      WHERE mes_cust_ord_dtl.co_cd = mrp_cust_ord_dtl.co_cd
          and mes_cust_ord_dtl.ord_no = mrp_cust_ord_dtl.ord_no
          and mes_cust_ord_dtl.sku_id = mrp_cust_ord_dtl.sku_id
      RETURNING mes_cust_ord_dtl.co_cd,mes_cust_ord_dtl.ord_no,mes_cust_ord_dtl.sku_id
  ) INSERT INTO mes_cust_ord_dtl (co_cd, ord_no, sku_id, ord_qty, shp_dt, ut_price, amt)
      SELECT co_cd, ord_no, sku_id, qty_no, de_dt, ut_price, ttl_amt
              FROM mrp_cust_ord_dtl
              WHERE NOT EXISTS (
                  SELECT 1
                  FROM upsert
                  WHERE co_cd = mrp_cust_ord_dtl.co_cd
                      and ord_no = mrp_cust_ord_dtl.ord_no
                      and sku_id = mrp_cust_ord_dtl.sku_id
              );
        `);
  }

  public async down(): Promise<void> {
    // No need to rollback
  }
}
