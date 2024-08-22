import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Province } from './entities/supplier.entity';
import { Repository } from 'typeorm';
import { PageOptionsDto } from 'src/utils/dtos/pageoptions-dto';
import { PageDto } from 'src/utils/dtos/page-dto';
import { ProvinceDto } from './dtos/province.dto';
import { PageMetaDto } from 'src/utils/dtos/pagemeta-dto';
import { QueryProvinceDto } from './dtos/query-province.dto';
import { CreateProvinceDto } from './dtos/create-province.dto';
import { transformToDto } from "../utils/transformToDto";

@Injectable()
export class ProvinceService {
  constructor(
    @InjectRepository(Province) private repo: Repository<Province>) {
  }

  async create(entity: CreateProvinceDto) {
    const checkExist = await this.findOneByProvincename(entity.name);
    if (checkExist) {
      throw new BadRequestException('Province is Already Registered');
    }
    const supplier = this.repo.create(entity);
    const supplierEntity = await this.repo.save(supplier);
    return supplierEntity;
  }

  async find(supplierQuery: QueryProvinceDto, pageOptionsDto: PageOptionsDto): Promise<PageDto<ProvinceDto>> {
    const queryBuilder = this.repo.createQueryBuilder("supplier");
    if (supplierQuery.name) {
      let nameQuery = supplierQuery.name;
      queryBuilder.where("supplier.name = :name", { name: nameQuery });
    }


    await queryBuilder.orderBy("supplier.createdAt", pageOptionsDto.order).skip(pageOptionsDto.skip).take(pageOptionsDto.take);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({ pageOptionsDto, itemCount });
    const suppliers = transformToDto(ProvinceDto, entities) as ProvinceDto[];

    return new PageDto(suppliers, pageMetaDto);
  }

  findOne(id: number) {
    return this.repo.findOne({
      where: {
        id: id
      }
    });
  }

  findByName(name: string) {
    return this.repo.findOne({
      where: {
        name: name
      }
    });
  }

  async update(id: number, attrs: Partial<Province>) {
    const supplier = await this.findOne(id);
    if (!supplier) {
      throw new NotFoundException('supplier not found');
    }
    if (attrs.id !== id) {
      throw new NotFoundException('supplier not found');
    }
    const checkExist = await this.findOneByProvincename(attrs.name);
    if (checkExist && checkExist.id !== supplier.id) {
      throw new BadRequestException('Province is Already Registered');
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
  findOneByProvincename(name: string) {
    return this.repo.findOne({
      where: {
        name: name
      }
    });
  }

}
