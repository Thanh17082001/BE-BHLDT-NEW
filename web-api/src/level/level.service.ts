import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateLevelDto } from './dto/create-level.dto';
import { UpdateLevelDto } from './dto/update-level.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Level } from './entities/level.entity';
import { Not, Repository } from 'typeorm';
import { PageOptionsDto } from 'src/utils/dtos/pageoptions-dto';
import { ItemDto, PageDto } from 'src/utils/dtos/page-dto';
import { difference } from 'src/utils/differeceArray';
import { PageMetaDto } from 'src/utils/dtos/pagemeta-dto';
import { TypeQuestion } from 'src/type-question/entities/type-question.entity';

@Injectable()
export class LevelService {
  constructor(
    @InjectRepository(Level) private repo: Repository<Level>,
    @InjectRepository(TypeQuestion) private repoTypeQuestion: Repository<TypeQuestion>,
  ) {
  }
  async create(createLevelDto: CreateLevelDto): Promise<Level> {
    const { name, order } = createLevelDto;
    const typeQuestion: TypeQuestion = await this.repoTypeQuestion.findOne({
      where: {
        id:createLevelDto.typeQuestionId
      }
    })
    const exits = await this.repo.findOne({
      where: {
        name:createLevelDto.name,
      }
    })
    if (exits) {
      throw new BadRequestException('Level year name is already!')
    }

    if (!typeQuestion) {
      throw new NotFoundException('Type question is not exist!')
    }
    return await this.repo.save({name, order, typeQuestion});
  }

  
  async findAll( pageOptions : PageOptionsDto, query: Partial<Level>): Promise<PageDto<Level>> {
    const queryBuilder = this.repo.createQueryBuilder('level').where('level.status = :status', { status: 1 }).leftJoinAndSelect('level.typeQuestion', 'type-question'); 
    if (!!query && Object.keys(query).length > 0) {
      const arrayQuery = difference(Object.keys(pageOptions), Object.keys(query))
     arrayQuery.forEach((key) => {
        if (key !== undefined && key !== null ) {
          queryBuilder.andWhere(`level.${key} = :${key}`, { [key]: query[key] });
        }
      });
    }

     if (pageOptions.search) {
      queryBuilder.andWhere('level.name LIKE :name', { name: `%${pageOptions.search}%` });
    }

    queryBuilder.orderBy("level.order", 'ASC')
      .addOrderBy("level.createdAt", pageOptions.order)
    .skip(pageOptions.skip)
      .take(pageOptions.take);
      
      const itemCount = await queryBuilder.getCount();
      const pageMetaDto = new PageMetaDto({pageOptionsDto:pageOptions, itemCount });
    const  entities  = await queryBuilder.getMany();

    return new PageDto(entities, pageMetaDto);
    
  }
  

  async findOne(id: number): Promise<ItemDto<Level>> {
    return new ItemDto(await this.repo.findOne({
      where: {
        id:id
      }
    }))
  }

  async update(id: number, updateLevel: Partial<UpdateLevelDto>): Promise<Level> {
    const level: Level = await this.repo.findOne({where:{id:id}});
    const typeQuestion: TypeQuestion = await this.repoTypeQuestion.findOne({
      where: {
        id:updateLevel.typeQuestionId
      }
    })
    const exits = await this.repo.findOne({
      where: {
        name:updateLevel.name,
        id: Not(id),
        status:1
      }
    })
    if (exits) {
      throw new BadRequestException('Level is already!')
    }
    if (!level) {
      throw new NotFoundException('Level does not exits!');
    }
    if (!typeQuestion) {
      throw new NotFoundException('Type question is not exist!')
    }
     const data = this.repo.merge(
      level,
      updateLevel,
    );
    data.typeQuestion = typeQuestion;
    return await this.repo.save(data);
  }

  async remove(id: number):Promise<Level> {
    const level: Level = await this.repo.findOne({where:{id}});
    if (!level) {
      throw new NotFoundException('Level year does not exits!');
    }
    return await this.repo.remove(level);
  }

}