import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Supplier } from './entities/supplier.entity';
import { Repository } from 'typeorm';
import { PageOptionsDto } from 'src/utils/dtos/pageoptions-dto';
import { PageDto } from 'src/utils/dtos/page-dto';
import { SupplierDto } from './dtos/supplier.dto';
import { PageMetaDto } from 'src/utils/dtos/pagemeta-dto';
import { QuerySupplierDto } from './dtos/query-supplier.dto';
import { CreateSupplierDto } from './dtos/create-supplier.dto';
import { plainToInstance } from "class-transformer";
import { transformToDto } from "../utils/transformToDto";

@Injectable()
export class SupplierService {
  constructor(
    @InjectRepository(Supplier) private repo: Repository<Supplier>) {
  }

  async create(entity: CreateSupplierDto) {
    const checkExist = await this.findOneBySuppliername(entity.name);
    if (checkExist) {
      throw new BadRequestException('Supplier is Already Registered');
    }
    const supplier = this.repo.create(entity);
    const supplierEntity = await this.repo.save(supplier);
    return supplierEntity;
  }

  async find(supplierQuery: QuerySupplierDto, pageOptionsDto: PageOptionsDto): Promise<PageDto<SupplierDto>> {
    const queryBuilder = this.repo.createQueryBuilder("supplier");
    if (supplierQuery.name) {
      let nameQuery = supplierQuery.name;
      console.log("name query ", nameQuery);
      queryBuilder.where("supplier.name = :name", { name: nameQuery });
    }

    console.log("pageOptionsDto.skip", pageOptionsDto.skip);
    console.log("pageOptionsDto.take", pageOptionsDto.take);

    await queryBuilder.orderBy("supplier.createdAt", pageOptionsDto.order).skip(pageOptionsDto.skip).take(pageOptionsDto.take);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({ pageOptionsDto, itemCount });

    console.log("find all suppliers - entities 22", entities);
    console.log("find all suppliers - itemCount", itemCount);
    const suppliers = transformToDto(SupplierDto, entities) as SupplierDto[];
    console.log('transform', suppliers);

    return new PageDto(suppliers, pageMetaDto);
  }

  findOne(id: number) {
    return this.repo.findOne({
      where: {
        id: id
      }
    });
  }

  async update(id: number, attrs: Partial<Supplier>) {
    const supplier = await this.findOne(id);
    if (!supplier) {
      throw new NotFoundException('supplier not found');
    }
   if (attrs.id!==id) {
      throw new NotFoundException('supplier not found');
    }
      const checkExist = await this.findOneBySuppliername(attrs.name);
    if (checkExist &&checkExist.id!==supplier.id) {
      throw new BadRequestException('Supplier is Already Registered');
    }
    Object.assign(supplier, attrs);
    console.log("last", supplier);

    return this.repo.save(supplier);
  }

  async remove(id: number) {
    const supplier = await this.findOne(id);
    if (!supplier) {
      throw new NotFoundException('supplier not found');
    }
    return this.repo.remove(supplier);
  }
  findOneBySuppliername(name: string) {
    return this.repo.findOne({
      where: {
        name: name
      }
    });
  }

}
