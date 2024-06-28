import { RoleEntity } from './role.entity';
import { CompanyModel, CustomerModel, CustomerOrderModel } from './co.model';
import { CustomerOrderDetailEntity } from './customerorderdetail.entity';
import { LineEntity } from './line.entity';
import { FloorEntity } from './floor.entity';
import { PDAHistEntity } from './pdahis.entity';
import { InboundEntity } from './inbound.entity';
import { OutboundDetailEntity } from './outboundDetail.entity';
import { OutboundEntity } from './outbound.entity';

export default [
  RoleEntity,
  CustomerOrderModel,
  CompanyModel,
  CustomerModel,
  CustomerOrderDetailEntity,
  LineEntity,
  FloorEntity,
  PDAHistEntity,
  InboundEntity,
  OutboundEntity,
  OutboundDetailEntity,
];

export {
  RoleEntity,
  CustomerOrderModel,
  CompanyModel,
  CustomerModel,
  CustomerOrderDetailEntity,
  FloorEntity,
  LineEntity,
  PDAHistEntity,
  InboundEntity,
  OutboundEntity,
  OutboundDetailEntity,
};
