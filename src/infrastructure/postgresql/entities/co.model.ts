export class CompanyModel {
  coCd: string;
  coNm: string;

  constructor(coCd: string, coNm: string) {
    this.coCd = coCd;
    this.coNm = coNm;
  }
}

export class CustomerModel {
  custCd: string;
  custEngNm: string;
  coCd: string;

  constructor(custCd: string, custEngNm: string, coCd: string) {
    this.custCd = custCd;
    this.custEngNm = custEngNm;
    this.coCd = coCd;
  }
}

export class CustomerOrderModel {
  coCd: string;
  custCd: string;
  ordNo: string;
  ordDt: Date;
  custPurOrdNo: string;
  custRflCd: string;
  rpmntPurOrdNo: string;
  stsCd: string;
  custOrdDesc: string;

  constructor(
    coCd: string,
    custCd: string,
    ordNo: string,
    ordDt: Date,
    custPurOrdNo: string,
    custRflCd: string,
    rpmntPurOrdNo: string,
    stsCd: string,
    custOrdDesc: string,
  ) {
    this.coCd = coCd;
    this.custCd = custCd;
    this.ordNo = ordNo;
    this.ordDt = ordDt;
    this.custPurOrdNo = custPurOrdNo;
    this.custRflCd = custRflCd;
    this.rpmntPurOrdNo = rpmntPurOrdNo;
    this.stsCd = stsCd;
    this.custOrdDesc = custOrdDesc;
  }
}
