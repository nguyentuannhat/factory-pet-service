import { Transport } from '@nestjs/microservices';

export const getGRPC = () => {
  return {
    transport: Transport.GRPC,
    options: {
      url: `0.0.0.0:${process.env.PORT || '50051'}`,
      package: [
        'app.payment.role.service.v1',
        'app.payment.user.service.v1',
        'app.mes.customerorder.service.v1',
        'app.mes.customerorderdetail.service.v1',
        'app.mes.line.service.v1',
        'app.mes.inbound.service.v1',
        'app.mes.customer.service.v1',
        'app.mes.pdahis.service.v1',
        'app.mes.outbound.service.v1',
        'app.mes.outbounddetail.service.v1',
      ],
      protoPath: [
        // base
        'app/payment/base/role/v1/role.proto',
        'app/payment/base/user/v1/user.proto',
        'app/mes/base/customerorder/v1/customerorder.proto',
        'app/mes/base/customerorderdetail/v1/customerorderdetail.proto',
        'app/mes/base/line/v1/line.proto',
        'app/mes/base/inbound/v1/inbound.proto',
        'app/mes/base/outbound/v1/outbound.proto',
        'app/mes/base/outbounddetail/v1/outbounddetail.proto',
        'app/mes/base/customer/v1/customer.proto',
        'app/mes/base/pdahis/v1/pdahis.proto',

        // service
        'app/payment/role/service/v1/role.proto',
        'app/payment/user/service/v1/user.proto',
        'app/mes/customerorder/service/v1/customerorder.proto',
        'app/mes/customerorderdetail/service/v1/customerorderdetail.proto',
        'app/mes/line/service/v1/line.proto',
        'app/mes/inbound/service/v1/inbound.proto',
        'app/mes/outbound/service/v1/outbound.proto',
        'app/mes/outbounddetail/service/v1/outbounddetail.proto',
        'app/mes/customer/service/v1/customer.proto',
        'app/mes/pdahis/service/v1/pdahis.proto',
      ],
      loader: {
        includeDirs: ['./node_modules/@clv-factory/protobuf/dist'],
        defaults: true,
      },
    },
  };
};
