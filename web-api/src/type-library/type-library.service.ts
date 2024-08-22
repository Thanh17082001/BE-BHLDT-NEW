import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTypeLibraryDto } from './dto/create-type-library.dto';
import { UpdateTypeLibraryDto } from './dto/update-type-library.dto';
import { TypeLibrary } from './entities/type-library.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PageOptionsDto } from 'src/utils/dtos/pageoptions-dto';
import { PageMetaDto } from 'src/utils/dtos/pagemeta-dto';
import { PageDto } from 'src/utils/dtos/page-dto';
import { TypeLibraryDto } from './dto/type-library-dto';
import { difference } from 'src/utils/differeceArray';

@Injectable()
export class TypeLibraryService {
  constructor(
    @InjectRepository(TypeLibrary) private repo: Repository<TypeLibrary>) {
  }
  async create(createTypeLibraryDto: CreateTypeLibraryDto) :Promise<TypeLibraryDto> {
    return await this.repo.save(createTypeLibraryDto);
  }

  async findAll(pageOptions : PageOptionsDto, queryTypeLibrary: Partial<TypeLibraryDto>): Promise<PageDto<CreateTypeLibraryDto>> {
    const queryBuilder = this.repo.createQueryBuilder('type-library')

    if (!!queryTypeLibrary && Object.keys(queryTypeLibrary).length > 0) {
      const arrayQuery =difference(Object.keys(pageOptions),Object.keys(queryTypeLibrary) )
     arrayQuery.forEach((key) => {
        if (key !== undefined && key !== null ) {
          queryBuilder.andWhere(`type-library.${key} = :${key}`, { [key]: queryTypeLibrary[key] });
        }
      });
    }

    queryBuilder.orderBy("type-library.createdAt", pageOptions.order)
    .skip(pageOptions.skip)
      .take(pageOptions.take);
      
      const itemCount = await queryBuilder.getCount();
      const pageMetaDto = new PageMetaDto({pageOptionsDto:pageOptions, itemCount });
    const { entities } = await queryBuilder.getRawAndEntities();

    return new PageDto(entities, pageMetaDto);
    
  }

  

  async findOne(id: number): Promise<TypeLibrary> {
    return this.repo.findOne({
      where: {
        id:id
      }
    })
  }

  async update(id: number, updateTypeLibraryDto: Partial<UpdateTypeLibraryDto>): Promise<TypeLibrary> {
    const typeLib: TypeLibrary = await this.findOne(id);
    if (!typeLib) {
      throw new NotFoundException('user not found');
    }
     const userData = this.repo.merge(
      typeLib,
      updateTypeLibraryDto,
    );
    return await this.repo.save(userData);
  }

  remove(id: number) {
    return `This action removes a #${id} typeLibrary`;
  }
}
