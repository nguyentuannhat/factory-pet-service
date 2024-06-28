import {
  DataSource,
  DeepPartial,
  FindManyOptions,
  FindOptionsWhere,
  ObjectLiteral,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import * as pagination from 'nestjs-typeorm-paginate';
import { keys, set } from 'lodash';

export interface IRepository<Entity extends ObjectLiteral> {
  findById(id: number): Promise<Entity | null>;

  findAll(options?: FindManyOptions<Entity>): Promise<Entity[] | null>;

  create(doc: DeepPartial<Entity>): Entity;

  batchCreate(doc: DeepPartial<Entity>[]): Entity[];

  updateById(id: number, doc: DeepPartial<Entity>): Promise<Entity | null>;

  getRepository(): Repository<Entity>;

  countBy(
    where: FindOptionsWhere<Entity> | FindOptionsWhere<Entity>[],
  ): Promise<number>;
}

export class AbstractRepository<Entity extends ObjectLiteral>
  implements IRepository<Entity>
{
  protected readonly repository: Repository<Entity>;
  public readonly dataSource: DataSource;

  constructor(baseRepository: Repository<Entity>, dataSource?: DataSource) {
    this.repository = baseRepository;
    this.dataSource = dataSource;
  }

  async findById(id): Promise<Entity | null> {
    return await this.repository.findOneBy({ id });
  }

  async findAll(options?: FindManyOptions<Entity>): Promise<Entity[]> {
    return await this.repository.find(options);
  }

  async findManyWithPagination(
    options: pagination.IPaginationOptions,
  ): Promise<pagination.Pagination<Entity>> {
    return pagination.paginate<Entity>(this.repository, options);
  }

  async paginateRaw<T>(
    selectQueryBuilder: SelectQueryBuilder<Entity>,
    options: pagination.IPaginationOptions,
  ): Promise<pagination.Pagination<Entity | T>> {
    return await pagination.paginateRaw(selectQueryBuilder, options);
  }

  async paginate(
    selectQueryBuilder: SelectQueryBuilder<Entity>,
    options: pagination.IPaginationOptions,
  ): Promise<pagination.Pagination<Entity>> {
    return pagination.paginate<Entity>(selectQueryBuilder, options);
  }

  create(doc: DeepPartial<Entity>): Entity {
    return this.repository.create(doc);
  }

  batchCreate(doc: DeepPartial<Entity>[]): Entity[] {
    return this.repository.create(doc);
  }

  async updateById(id: number, doc: DeepPartial<Entity>): Promise<Entity> {
    const foundInstance = await this.findById(id);

    keys(doc).forEach((key) => {
      set(foundInstance, key, doc[key]);
    });

    return await foundInstance.save();
  }

  async countBy(
    where: FindOptionsWhere<Entity> | FindOptionsWhere<Entity>[],
  ): Promise<number> {
    return await this.repository.countBy(where);
  }

  getRepository(): Repository<Entity> {
    return this.repository;
  }
}
