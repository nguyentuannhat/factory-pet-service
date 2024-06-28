export interface CustomExceptionDetails {
  type: string;
  details: string;
  domain: string | 'mes-domain.factory.clv.com';
  metadata: { service: string | 'MES_MICROSERVICE' };
}
