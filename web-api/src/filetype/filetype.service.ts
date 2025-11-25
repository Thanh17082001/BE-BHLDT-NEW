import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FileType } from './entities/filetype.entity';
import { Repository } from 'typeorm';
import { PageOptionsDto } from 'src/utils/dtos/pageoptions-dto';
import { PageDto } from 'src/utils/dtos/page-dto';
import { FileTypeDto } from './dtos/filetype.dto';
import { PageMetaDto } from 'src/utils/dtos/pagemeta-dto';
import { QueryFileTypeDto } from './dtos/query-filetype.dto';
import { CreateFileTypeDto } from './dtos/create-filetype.dto';
import { plainToInstance } from "class-transformer";
import { transformToDto } from "../utils/transformToDto";

@Injectable()
export class FileTypeService {
  constructor(
    @InjectRepository(FileType) private repo: Repository<FileType>) {
  }

  async create(entity: CreateFileTypeDto) {

    const fileType = this.repo.create(entity);
    const fileTypeEntity = await this.repo.save(fileType);
    return fileTypeEntity;
  }

  async find(fileTypeQuery: QueryFileTypeDto, pageOptionsDto: PageOptionsDto): Promise<PageDto<FileTypeDto>> {
    const queryBuilder = this.repo.createQueryBuilder("fileType");
    if (fileTypeQuery.name) {
      let nameQuery = fileTypeQuery.name;
      console.log("name query ", nameQuery);
      queryBuilder.where("fileType.name = :name", { name: nameQuery });
    }


    await queryBuilder.orderBy("fileType.createdAt", pageOptionsDto.order).skip(pageOptionsDto.skip).take(pageOptionsDto.take);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({ pageOptionsDto, itemCount });

    
    const fileTypes = transformToDto(FileTypeDto, entities) as FileTypeDto[];

    return new PageDto(fileTypes, pageMetaDto);
  }

  findOne(id: number) {
    return this.repo.findOne({
      where: {
        id: id
      }
    });
  }

  async update(id: number, attrs: Partial<FileType>) {
    const fileType = await this.findOne(id);
    if (!fileType) {
      throw new NotFoundException('fileType not found');
    }
    if (attrs.id !== id) {
      throw new NotFoundException('fileType not found');
    }
    Object.assign(fileType, attrs);
    return this.repo.save(fileType);
  }

  async remove(id: number) {
    const fileType = await this.findOne(id);
    if (!fileType) {
      throw new NotFoundException('fileType not found');
    }
    return this.repo.remove(fileType);
  }
  findOneByFileTypename(name: string) {
    return this.repo.findOne({
      where: {
        name: name
      }
    });
  }

}
