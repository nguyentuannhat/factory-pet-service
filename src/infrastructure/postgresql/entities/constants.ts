import { ColumnType } from 'typeorm';

export const TABLE_MES_FLR = 'mes_flr';
export const TABLE_MES_LINE = 'mes_line';
export const TABLE_MES_PDA_HIS = 'mes_pda_his';
export const TABLE_MES_IB_PROD = 'mes_ib_prod';
export const TABLE_MES_OB_PROD = 'mes_ob_prod';
export const TABLE_MES_OB_PROD_DTL = 'mes_ob_prod_dtl';
export const TABLE_MES_CUST_ORD_DTL = 'mes_cust_ord_dtl';
export const TABLE_MES_ROLE = 'mes_role';

export const MES_FLR_NAME = {
  flrId: 'flr_id',
  flrCd: 'flr_cd',
  flrNm: 'flr_nm',
};

export const MES_LINE_NAME = {
  lineId: 'line_id',
  lineNm: 'line_nm',
  lineCapa: 'line_capa',
  coCd: 'co_cd',
};

export const MES_PDA_HIS_NAME = {
  pdaHisId: 'pda_his_id',
  // operationType
  opTp: 'op_tp',
  custOrdDtlId: 'cust_ord_dtl_id',
  creDt: 'cre_dt',
  updDt: 'upd_dt',
  updUsrId: 'upd_usr_id',
  // quality
  qlty: 'qlty',
  coCd: 'co_cd',
  // quantity
  qty: 'qty',
  creUsrId: 'cre_usr_id',
  lineId: 'line_id',
  lineNm: 'line_nm',
  pckIdSeq: 'pck_id_seq',
};

export const MES_IB_PROD_NAME = {
  ibId: 'ib_id',
  ibNo: 'ib_no',
  custOrdDtlId: 'cust_ord_dtl_id',
  ibQty: 'ib_qty',
  coCd: 'co_cd',
  pkgDt: 'pkg_dt',
  ibDt: 'ib_dt',
  lineId: 'line_id',
  lineNm: 'line_nm',
  creDt: 'cre_dt',
  updDt: 'upd_dt',
  creUsrId: 'cre_usr_id',
  updUsrId: 'upd_usr_id',
};

export const MES_OB_PROD_NAME = {
  obId: 'ob_id',
  rqstNo: 'rqst_no',
  coCd: 'co_cd',
  rqstDt: 'rqst_dt',
  rqstObDt: 'rqst_ob_dt',
  obNo: 'ob_no',
  obDt: 'ob_dt',
  rqstQty: 'rqst_qty',
  // Stock Qty
  stkQty: 'stk_qty',
  obQty: 'ob_qty',
  // Status
  sts: 'sts',
  // Remark
  rmk: 'rmk',
  creDt: 'cre_dt',
  updDt: 'upd_dt',
  creUsrId: 'cre_usr_id',
  updUsrId: 'upd_usr_id',
};

export const MES_OB_PROD_DTL_NAME = {
  obDtlId: 'ob_dtl_id',
  rqstNo: 'rqst_no',
  skuId: 'sku_id',
  ordNo: 'ord_no',
  rqstQty: 'rqst_qty',
  stkQty: 'stk_qty',
  obQty: 'ob_qty',
  obId: 'ob_id',
  note: 'note',
  creDt: 'cre_dt',
  updDt: 'upd_dt',
  creUsrId: 'cre_usr_id',
  updUsrId: 'upd_usr_id',
};

export const MES_CUST_ORD_DTL_NAME = {
  custOrdDtlId: 'cust_ord_dtl_id',
  coCd: 'co_cd',
  ordNo: 'ord_no',
  skuId: 'sku_id',
  ordQty: 'ord_qty',
  shpDt: 'shp_dt',
  ibQty: 'ib_qty',
  obQty: 'ob_qty',
  // unitPrice
  utPrice: 'ut_price',
  // amount
  amt: 'amt',
  shpTo: 'shp_to',
  fnQty: 'fn_qty',
  pckQty: 'pck_qty',
  barCd: 'bar_cd',
};

export const MES_ROLE_NAME = {
  roleId: 'role_id',
  roleNm: 'role_nm',
  // Corlor
  colr: 'colr',
  sts: 'sts',
};

export const MRP_PROD_NAME = {
  skuId: 'sku_id',
  prodNm: 'prod_nm',
};

export const DEFAULT_TYPE_DATA: { [key: string]: ColumnType } = {
  VARCHAR: 'varchar',
  TIMESTAMP: 'timestamp',
  FLOAT: 'float',
  INTEGER: 'integer',
  NUMBERIC: 'numeric',
  BIT: 'bit',
  SIMPLE_ARRAY: 'simple-array',
  ENUM: 'enum',
};

export const DATA_LENGTH: { [key: string]: number } = {
  '255': 255,
};

export const DEFAULT_BATCH_INSERT_SIZE = 500;
