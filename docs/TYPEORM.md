## Datasource
[https://typeorm.io/data-source](https://typeorm.io/data-source)

## Entity
[https://typeorm.io/entities](https://typeorm.io/entities)

## Relations
[https://typeorm.io/relations](https://typeorm.io/relations)

## OPEN API - Mapped Types
[https://docs.nestjs.com/openapi/mapped-types](https://docs.nestjs.com/openapi/mapped-types)

## Commands

```bash
# create migration
$ yarn migration:create

# run migration
$ yarn migration:run

# revert migration
$ yarn migration:revert

# run migration sync customer order detail data from mrp to mes
$ yarn env-cmd -f env/.env.local ts-node -r tsconfig-paths/register ./src/scripts/run-sync-co-detail-migration.ts
```



curl -d '{"username":"u1","age": 10, "email":"abc@gmail.com","dob": "01-01-2023"}' -H "Content-Type: application/json" -X POST http://localhost:3000/user/v1 | jq .