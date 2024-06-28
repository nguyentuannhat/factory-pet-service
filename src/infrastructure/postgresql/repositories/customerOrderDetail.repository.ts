import { GetCustomerOrderRequest } from '@clv-factory/protobuf/dist/gRPC/generate/index.app.mes.customerorder.service.v1';
import {
  GetBarcodeFinishRequest,
  GetCustomerOrderDetailRequest,
  GetDataExportBarcodeRequest,
} from '@clv-factory/protobuf/dist/gRPC/generate/index.app.mes.customerorderdetail.service.v1';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { format } from 'date-fns';
import { CustomerOrderDTO } from 'src/domains/customerorder/domain.customerorder.dto';
import {
  CreateCustomerOrderDetailDTO,
  CustomerOrderDetailDTO,
} from 'src/domains/customerorderdetail/domain.customerorderdetail.dto';
import { In, ObjectLiteral, Repository } from 'typeorm';
import { CustomerOrderDetailEntity } from '../entities';
import { AbstractRepository, IRepository } from './abstract.repository';
import {
  MES_CUST_ORD_DTL_NAME,
  MRP_PROD_NAME,
  TABLE_MES_CUST_ORD_DTL,
} from 'src/infrastructure/postgresql/entities/constants';

export const I_CUSTOMERORDERDETAIL_REPOSITORY =
  'I_CUSTOMER_ORDER_DETAIL_REPOSITORY';

export interface ICustomerOrderDetailRepository
  extends IRepository<CustomerOrderDetailEntity> {
  getCustomerOrder: (
    payload: GetCustomerOrderRequest,
  ) => Promise<CustomerOrderDTO[]>;
  getCustomerOrderDetail: (
    payload: GetCustomerOrderDetailRequest,
  ) => Promise<CustomerOrderDetailDTO[]>;
  getBarcodeFinish: (
    payload: GetBarcodeFinishRequest,
  ) => Promise<CustomerOrderDetailDTO[]>;
  getDataExportBarcode: (
    payload: GetDataExportBarcodeRequest,
  ) => Promise<CustomerOrderDetailDTO[]>;

  isCustomerOrderDetailExist: (
    entity: Partial<CreateCustomerOrderDetailDTO>,
  ) => Promise<CustomerOrderDetailEntity>;
}

@Injectable()
export class CustomerOrderDetailRepository
  extends AbstractRepository<CustomerOrderDetailEntity>
  implements ICustomerOrderDetailRepository
{
  constructor(
    @InjectRepository(CustomerOrderDetailEntity)
    private custOrdDtlRepository: Repository<CustomerOrderDetailEntity>,
  ) {
    super(custOrdDtlRepository);
  }

  async getCustomerOrder(
    payload: GetCustomerOrderRequest,
  ): Promise<CustomerOrderDTO[]> {
    const { ordNo, custNm, shipTo, fmDt, toDt, coCd } = payload;

    let query = `
      SELECT
        cust.cust_eng_nm,
        custOrd.ord_no,
        CAST(custOrd.ord_dt AS timestamp) AS ord_dt,
        custOrd.de_dest_desc AS ship_to,
        SUM(${TABLE_MES_CUST_ORD_DTL}.${MES_CUST_ORD_DTL_NAME.ordQty}) ord_qty,
        SUM(${TABLE_MES_CUST_ORD_DTL}.${MES_CUST_ORD_DTL_NAME.fnQty}) fn_qty,
        SUM(${TABLE_MES_CUST_ORD_DTL}.${MES_CUST_ORD_DTL_NAME.pckQty}) pck_qty,
        SUM(${TABLE_MES_CUST_ORD_DTL}.${MES_CUST_ORD_DTL_NAME.ibQty}) ib_qty,
        SUM(${TABLE_MES_CUST_ORD_DTL}.${MES_CUST_ORD_DTL_NAME.obQty}) ob_qty
      FROM
        mrp_cust_ord custOrd
      LEFT JOIN
        mrp_cust cust ON custOrd.cust_cd = cust.cust_cd AND custOrd.co_cd = cust.co_cd
      LEFT JOIN
        ${TABLE_MES_CUST_ORD_DTL} ON ${TABLE_MES_CUST_ORD_DTL}.${MES_CUST_ORD_DTL_NAME.ordNo} = custOrd.ord_no 
        AND custOrd.co_cd = ${TABLE_MES_CUST_ORD_DTL}.${MES_CUST_ORD_DTL_NAME.coCd}
      WHERE 1=1
      AND custOrd.co_cd = '${coCd}'
    `;

    if (!(ordNo === undefined || ordNo === null || ordNo.length === 0)) {
      const ordNoConditions = ordNo
        .map((no: string) => `custOrd.ord_no = '${no.trim()}'`)
        .join(' OR ');
      query += ` AND (${ordNoConditions})`;
    }

    if (!(custNm === undefined || custNm === null || custNm.length === 0)) {
      const custNmConditions = custNm
        .map((name: string) => `cust.cust_eng_nm = '${name.trim()}'`)
        .join(' OR ');
      query += ` AND (${custNmConditions})`;
    }

    if (fmDt === null && toDt) {
      query += ` AND TO_CHAR(custOrd.ord_dt,'YYYYMMDD') <= '${format(
        toDt,
        'yyyyMMdd',
      )}'`;
    } else if (fmDt && toDt === null) {
      query += ` AND TO_CHAR(custOrd.ord_dt,'YYYYMMDD') >= '${format(
        fmDt,
        'yyyyMMdd',
      )}'`;
    } else if (fmDt && toDt) {
      query += ` AND TO_CHAR(custOrd.ord_dt,'YYYYMMDD') BETWEEN '${format(
        fmDt,
        'yyyyMMdd',
      )}' AND '${format(toDt, 'yyyyMMdd')}'`;
    }

    if (shipTo) {
      const replaceShipTo = shipTo.replace(/[%_]/g, (match) => `\\${match}`);
      const shipToLowerCase = replaceShipTo.toLowerCase().trim();
      query += ` AND LOWER(custOrd.de_dest_desc) LIKE '%${shipToLowerCase}%'`;
    }
    query += `
      GROUP BY
        cust.cust_cd,
        cust.cust_eng_nm,
        custOrd.ord_no,
        custOrd.ord_dt,
        custOrd.de_dest_desc
      ORDER BY
	      custOrd.ord_dt
    `;

    const result = await this.custOrdDtlRepository.query(query);
    return result.map((item: ObjectLiteral) => ({
      custEngNm: item.cust_eng_nm,
      ordDt: item.ord_dt,
      shipTo: item.ship_to,
      ordQty: item.ord_qty,
      fnQty: item.fn_qty,
      packingQty: item.pck_qty,
      ibQty: item.ib_qty,
      obQty: item.ob_qty,
      ordNo: item.ord_no,
    }));
  }

  async getCustomerOrderDetail(
    payload: GetCustomerOrderDetailRequest,
  ): Promise<CustomerOrderDetailDTO[]> {
    const { ordNo, custNm, shipTo, ordDt, coCd } = payload;

    let query = `
      SELECT
      ${TABLE_MES_CUST_ORD_DTL}.${MES_CUST_ORD_DTL_NAME.skuId},
        prod.${MRP_PROD_NAME.prodNm},
        ${TABLE_MES_CUST_ORD_DTL}.${MES_CUST_ORD_DTL_NAME.ordQty},
        CAST(${TABLE_MES_CUST_ORD_DTL}.${MES_CUST_ORD_DTL_NAME.shpDt} AS timestamp) AS shp_dt,
        ${TABLE_MES_CUST_ORD_DTL}.${MES_CUST_ORD_DTL_NAME.fnQty},
        ${TABLE_MES_CUST_ORD_DTL}.${MES_CUST_ORD_DTL_NAME.pckQty},
        ${TABLE_MES_CUST_ORD_DTL}.${MES_CUST_ORD_DTL_NAME.ibQty},
        ${TABLE_MES_CUST_ORD_DTL}.${MES_CUST_ORD_DTL_NAME.obQty},
        ${TABLE_MES_CUST_ORD_DTL}.${MES_CUST_ORD_DTL_NAME.utPrice},
        ${TABLE_MES_CUST_ORD_DTL}.${MES_CUST_ORD_DTL_NAME.custOrdDtlId},
        ${TABLE_MES_CUST_ORD_DTL}.${MES_CUST_ORD_DTL_NAME.amt},
        ${TABLE_MES_CUST_ORD_DTL}.${MES_CUST_ORD_DTL_NAME.shpTo},
        ${TABLE_MES_CUST_ORD_DTL}.${MES_CUST_ORD_DTL_NAME.barCd}
      FROM
        ${TABLE_MES_CUST_ORD_DTL}
      LEFT JOIN
        mrp_prod prod ON ${TABLE_MES_CUST_ORD_DTL}.${MES_CUST_ORD_DTL_NAME.skuId} = prod.${MRP_PROD_NAME.skuId}
      LEFT JOIN
        mrp_cust_ord custOrd ON custOrd.ord_no = ${TABLE_MES_CUST_ORD_DTL}.${MES_CUST_ORD_DTL_NAME.ordNo} 
        AND custOrd.co_cd = ${TABLE_MES_CUST_ORD_DTL}.${MES_CUST_ORD_DTL_NAME.coCd}
      LEFT JOIN
        mrp_cust cust ON cust.cust_cd = custOrd.cust_cd AND custOrd.co_cd = cust.co_cd
      WHERE 1=1
      AND custOrd.co_cd = '${coCd}'
    `;

    if (ordNo) {
      query += ` AND ${TABLE_MES_CUST_ORD_DTL}.${MES_CUST_ORD_DTL_NAME.ordNo} = '${ordNo}'`;
    }

    if (custNm) {
      query += ` AND cust.cust_eng_nm = '${custNm}'`;
    }

    if (ordDt) {
      query += ` AND TO_CHAR(custOrd.ord_dt,'YYYYMMDD') = '${format(
        ordDt,
        'yyyyMMdd',
      )}'`;
    }

    if (shipTo) {
      query += ` AND custOrd.de_dest_desc = '${shipTo}'`;
    }

    const result = await this.custOrdDtlRepository.query(query);
    return result.map((item: ObjectLiteral) => ({
      skuId: item.sku_id,
      prodNm: item.prod_nm,
      ordQty: item.ord_qty,
      shipDt: item.shp_dt,
      fnQty: item.fn_qty,
      packingQty: item.pck_qty,
      ibQty: item.ib_qty,
      obQty: item.ob_qty,
      unitPrice: item.ut_price,
      amount: item.amt,
      shipTo: item.shp_to,
      custOrdDtlId: item.cust_ord_dtl_id,
      barcode: item.bar_cd,
    }));
  }

  async getDataExportBarcode(
    payload: GetDataExportBarcodeRequest,
  ): Promise<CustomerOrderDetailDTO[]> {
    const { custOrdDtlId } = payload;
    const barcodeEntities = await this.findAll({
      where: { custOrdDtlId: In(custOrdDtlId) },
    });
    const formattedDate = 'CS' + format(new Date(), 'ddMMyyyy');

    const latestBarcode: string = await this.custOrdDtlRepository
      .createQueryBuilder(TABLE_MES_CUST_ORD_DTL)
      .select(
        `MAX(${TABLE_MES_CUST_ORD_DTL}.${MES_CUST_ORD_DTL_NAME.barCd})`,
        'maxBarcode',
      )
      .where(
        `${TABLE_MES_CUST_ORD_DTL}.${MES_CUST_ORD_DTL_NAME.barCd} LIKE :prefix`,
        {
          prefix: `${formattedDate}%`,
        },
      )
      .getRawOne()
      .then((result) => result.maxBarcode);

    if (latestBarcode === null || latestBarcode === '') {
      let seq = 1;
      barcodeEntities.forEach(async (element) => {
        const barcd = formattedDate + seq.toString().padStart(6, '0');
        element.barcode = barcd;
        seq++;
        await this.custOrdDtlRepository.save(element);
      });
    } else {
      let seq = parseInt(latestBarcode.slice(10)) + 1;

      barcodeEntities.forEach(async (element) => {
        if (
          element.barcode === null ||
          !element.barcode.includes(formattedDate)
        ) {
          //gen barcode & save
          const barcd = formattedDate + seq.toString().padStart(6, '0');
          element.barcode = barcd;
          seq++;
          await this.custOrdDtlRepository.save(element);
        }
      });
    }

    return barcodeEntities.map((item: ObjectLiteral) => ({
      skuId: null,
      prodNm: null,
      ordQty: null,
      shipDt: null,
      fnQty: null,
      packingQty: null,
      ibQty: null,
      obQty: null,
      unitPrice: null,
      amount: null,
      barcode: item.barcode,
      ordDt: null,
      ordNo: null,
      shipTo: null,
      custOrdDtlId: item.custOrdDtlId,
      custEngNm: null,
    }));
  }
  async getBarcodeFinish(
    payload: GetBarcodeFinishRequest,
  ): Promise<CustomerOrderDetailDTO[]> {
    const { barcode } = payload;

    let query = `
      SELECT
      ${TABLE_MES_CUST_ORD_DTL}.${MES_CUST_ORD_DTL_NAME.skuId},
        prod.${MRP_PROD_NAME.prodNm},
        ${TABLE_MES_CUST_ORD_DTL}.${MES_CUST_ORD_DTL_NAME.ordQty},
        CAST(${TABLE_MES_CUST_ORD_DTL}.${MES_CUST_ORD_DTL_NAME.shpDt} AS timestamp) AS ${MES_CUST_ORD_DTL_NAME.shpDt},
        ${TABLE_MES_CUST_ORD_DTL}.${MES_CUST_ORD_DTL_NAME.fnQty},
        ${TABLE_MES_CUST_ORD_DTL}.${MES_CUST_ORD_DTL_NAME.pckQty},
        ${TABLE_MES_CUST_ORD_DTL}.${MES_CUST_ORD_DTL_NAME.ibQty},
        ${TABLE_MES_CUST_ORD_DTL}.${MES_CUST_ORD_DTL_NAME.obQty},
        ${TABLE_MES_CUST_ORD_DTL}.${MES_CUST_ORD_DTL_NAME.ordNo},
        ${TABLE_MES_CUST_ORD_DTL}.${MES_CUST_ORD_DTL_NAME.custOrdDtlId},
        ${TABLE_MES_CUST_ORD_DTL}.${MES_CUST_ORD_DTL_NAME.utPrice},
        ${TABLE_MES_CUST_ORD_DTL}.${MES_CUST_ORD_DTL_NAME.amt},
        ${TABLE_MES_CUST_ORD_DTL}.${MES_CUST_ORD_DTL_NAME.shpTo},
        ${TABLE_MES_CUST_ORD_DTL}.${MES_CUST_ORD_DTL_NAME.barCd}
      FROM
        ${TABLE_MES_CUST_ORD_DTL}
      LEFT JOIN
        mrp_prod prod ON ${TABLE_MES_CUST_ORD_DTL}.${MES_CUST_ORD_DTL_NAME.skuId} = prod.${MRP_PROD_NAME.skuId}
      LEFT JOIN
        mrp_cust_ord custOrd ON custOrd.ord_no = ${TABLE_MES_CUST_ORD_DTL}.${MES_CUST_ORD_DTL_NAME.ordNo}
      LEFT JOIN
        mrp_cust cust ON cust.cust_cd = custOrd.cust_cd AND custOrd.co_cd = cust.co_cd
      WHERE 1=1
    `;

    if (barcode) {
      query += ` AND ${TABLE_MES_CUST_ORD_DTL}.${MES_CUST_ORD_DTL_NAME.barCd} = '${barcode}'`;
    }

    const result = await this.custOrdDtlRepository.query(query);
    return result.map((item: ObjectLiteral) => ({
      skuId: item.sku_id,
      prodNm: item.prod_nm,
      ordQty: item.ord_qty,
      shipDt: item.shp_dt,
      fnQty: item.fn_qty,
      packingQty: item.pck_qty,
      ibQty: item.ib_qty,
      obQty: item.ob_qty,
      unitPrice: item.ut_price,
      amount: item.amt,
      shipTo: item.shp_to,
      barcode: item.bar_cd,
      ordNo: item.ord_no,
      custOrdDtlId: item.cust_ord_dtl_id,
    }));
  }

  async isCustomerOrderDetailExist(
    entity: Partial<CreateCustomerOrderDetailDTO>,
  ): Promise<CustomerOrderDetailEntity> {
    const found = await this.custOrdDtlRepository.findOne({
      where: {
        coCd: entity.coCd,
        ordNo: entity.ordNo,
        skuId: entity.skuId,
      },
    });
    return found;
  }
}
