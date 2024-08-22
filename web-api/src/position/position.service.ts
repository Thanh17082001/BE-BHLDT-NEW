import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Position } from './entities/position.entity';
import { Repository } from 'typeorm';
import { PositionInterface } from './interface/position.interface';
import { PageOptionsDto } from 'src/utils/dtos/pageoptions-dto';
import { UpdateBookDto } from 'src/book/dto/update-book.dto';
import { difference } from 'src/utils/differeceArray';
import { PageDto } from 'src/utils/dtos/page-dto';
import { PageMetaDto } from 'src/utils/dtos/pagemeta-dto';
import { School } from 'src/school/entities/school.entity';

@Injectable()
export class PositionService {
  constructor(
    @InjectRepository(Position) private repo: Repository<Position>, @InjectRepository(School) private readonly schoolRepository: Repository<School>,) {
  }
  async create(createPositionDto: CreatePositionDto): Promise<PositionInterface> {
    const { name, schoolId } = createPositionDto;
    const school: School = await this.schoolRepository.findOne({ where: { id: +schoolId } })
    if (!school) {
      throw new BadRequestException('School is not empty or School not found')
    }
    const data = {
      name,school
    }
    return await this.repo.save(data);
  }

  async findAll(pageOptions : PageOptionsDto, queryPosition: Partial<PositionInterface>): Promise<PageDto<PositionInterface>> {
    const queryBuilder = this.repo.createQueryBuilder('position').innerJoinAndSelect('position.school', 'school')
    if (!!queryPosition && Object.keys(queryPosition).length > 0) {
      const arrayQuery = difference(Object.keys(pageOptions), Object.keys(queryPosition))
     arrayQuery.forEach((key) => {
        if (key !== undefined && key !== null ) {
          queryBuilder.andWhere(`position.${key} = :${key}`, { [key]: queryPosition[key] });
        }
      });
    }

    queryBuilder.orderBy("position.createdAt", pageOptions.order)
    .skip(pageOptions.skip)
      .take(pageOptions.take);
      
      const itemCount = await queryBuilder.getCount();
      const pageMetaDto = new PageMetaDto({pageOptionsDto:pageOptions, itemCount });
    const  entities  = await queryBuilder.getMany();

    return new PageDto(entities, pageMetaDto);
    
  }
  

  async findOne(id: number): Promise<PositionInterface> {
    return this.repo.findOne({
      where: {
        id:id
      },
      relations: ['school'],
    })
  }

  async update(id: number, updatePositionDto: Partial<UpdatePositionDto>): Promise<PositionInterface> {
    const typeLib: PositionInterface = await this.findOne(id);
    const school: School = await this.schoolRepository.findOne({
      where: {
        id:updatePositionDto.schoolId
      }
    })

    typeLib.school = school;
    if (!typeLib) {
      throw new NotFoundException('user not found');
    }
     const data = this.repo.merge(
      typeLib,
      updatePositionDto,
    );
    return await this.repo.save(data);
  }

}