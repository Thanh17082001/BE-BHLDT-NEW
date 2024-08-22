import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSchoolYearDto } from './dto/create-school-year.dto';
import { UpdateSchoolYearDto } from './dto/update-school-year.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SchoolYear } from './entities/school-year.entity';
import { Not, Repository } from 'typeorm';
import { PageOptionsDto } from 'src/utils/dtos/pageoptions-dto';
import { SchoolInterface } from 'src/school/interface/school.interface';
import { PageDto } from 'src/utils/dtos/page-dto';
import { difference } from 'src/utils/differeceArray';
import { PageMetaDto } from 'src/utils/dtos/pagemeta-dto';

@Injectable()
export class SchoolYearService {
  constructor(
    @InjectRepository(SchoolYear) private repo: Repository<SchoolYear>,
  ) {
  }
  async create(createSChoolYearDto: CreateSchoolYearDto): Promise<SchoolYear> {
    const exits = await this.repo.findOne({
      where: {
        name:createSChoolYearDto.name,
        status:1
      }
    })
    if (exits) {
      throw new BadRequestException('School year name is already!')
    }
    return await this.repo.save(createSChoolYearDto);
  }

  
  async findAll( pageOptions : PageOptionsDto, querySchol: Partial<SchoolYear>): Promise<PageDto<SchoolYear>> {
    const queryBuilder = this.repo.createQueryBuilder('school-year').where('school-year.status = :status', { status: 1 }); 
    if (!!querySchol && Object.keys(querySchol).length > 0) {
      const arrayQuery = difference(Object.keys(pageOptions), Object.keys(querySchol))
     arrayQuery.forEach((key) => {
        if (key !== undefined && key !== null && Object.keys(querySchol).includes(key) ) {
          queryBuilder.andWhere(`school-year.${key} = :${key}`, { [key]: querySchol[key] });
        }
     });
    }
    
     if (pageOptions.search) {
      queryBuilder.andWhere('school-year.name LIKE :name', { name: `%${pageOptions.search}%` });
    }

    queryBuilder.orderBy("school-year.createdAt", pageOptions.order)
    .skip(pageOptions.skip)
      .take(pageOptions.take);
      
      const itemCount = await queryBuilder.getCount();
      const pageMetaDto = new PageMetaDto({pageOptionsDto:pageOptions, itemCount });
    const  entities  = await queryBuilder.getMany();

    return new PageDto(entities, pageMetaDto);
    
  }
  

  async findOne(id: number): Promise<SchoolYear> {
    return this.repo.findOne({
      where: {
        id:id
      }
    })
  }

  async update(id: number, updateSchoolDto: Partial<UpdateSchoolYearDto>): Promise<SchoolYear> {
    const typeLib: SchoolYear = await this.findOne(id);
    const exits = await this.repo.findOne({
      where: {
        name:updateSchoolDto.name,
        id: Not(id),
        status:1
      }
    })
    if (exits) {
      throw new BadRequestException('School code is already!')
    }
    if (!typeLib) {
      throw new NotFoundException('school does not exits!');
    }
     const data = this.repo.merge(
      typeLib,
      updateSchoolDto,
    );
    return await this.repo.save(data);
  }

  async remove(id: number):Promise<SchoolYear> {
    const school: SchoolYear = await this.findOne(id);
    if (!school) {
      throw new NotFoundException('school year does not exits!');
    }
     const data = this.repo.merge(
      school,
      {status:0},
    );
    return await this.repo.save(data);
  }

}