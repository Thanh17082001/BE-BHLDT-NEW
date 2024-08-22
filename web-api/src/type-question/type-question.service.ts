import { BadRequestException, Injectable, NotFoundException, Type } from '@nestjs/common';
import { CreateTypeQuestionDto } from './dto/create-type-question.dto';
import { UpdateTypeQuestionDto } from './dto/update-type-question.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeQuestion } from './entities/type-question.entity';
import { Not, Repository } from 'typeorm';
import { PageOptionsDto } from 'src/utils/dtos/pageoptions-dto';
import { ItemDto, PageDto } from 'src/utils/dtos/page-dto';
import { difference } from 'src/utils/differeceArray';
import { PageMetaDto } from 'src/utils/dtos/pagemeta-dto';

@Injectable()
export class TypeQuestionService {
  constructor(
    @InjectRepository(TypeQuestion) private repo: Repository<TypeQuestion>,
  ) {
  }
  async create(createTypeQuestionDto: CreateTypeQuestionDto): Promise<TypeQuestion> {
    const exits = await this.repo.findOne({
      where: {
        name:createTypeQuestionDto.name,
      }
    })

    const exitsOrder = await this.repo.findOne({
      where: {
        order:createTypeQuestionDto.order,
      }
    })
    if (exits || exitsOrder) {
      throw new BadRequestException('Type question name or order is already!')
    }
    return await this.repo.save(createTypeQuestionDto);
  }

  
  async findAll( pageOptions : PageOptionsDto, query: Partial<TypeQuestion>): Promise<PageDto<TypeQuestion>> {
    const queryBuilder = this.repo.createQueryBuilder('type-question').where('type-question.status = :status', { status: 1 }); 
    if (!!query && Object.keys(query).length > 0) {
      const arrayQuery = difference(Object.keys(pageOptions), Object.keys(query))
     arrayQuery.forEach((key) => {
        if (key !== undefined && key !== null && key!='page' && key != 'take' && key != 'skip' && key != 'order') {
          queryBuilder.andWhere(`type-question.${key} = :${key}`, { [key]: query[key] });
        }
      });
    }

     if (pageOptions.search) {
      queryBuilder.andWhere('type-question.name LIKE :name', { name: `%${pageOptions.search}%` });
    }

    queryBuilder.orderBy("type-question.order", 'ASC')
      .addOrderBy("type-question.createdAt", pageOptions.order)
    .skip(pageOptions.skip)
      .take(pageOptions.take);
      
      const itemCount = await queryBuilder.getCount();
      const pageMetaDto = new PageMetaDto({pageOptionsDto:pageOptions, itemCount });
    const  entities  = await queryBuilder.getMany();

    return new PageDto(entities, pageMetaDto);
    
  }
  

  async findOne(id: number): Promise<ItemDto<TypeQuestion>> {
    return new ItemDto (await this.repo.findOne({
      where: {
        id:id
      }
    }))
  }

  async update(id: number, updateSchoolDto: Partial<UpdateTypeQuestionDto>): Promise<TypeQuestion> {
    const typeQuestion: TypeQuestion = await this.repo.findOne({
      where: {
        id:id
      }
    });
    const exits = await this.repo.findOne({
      where: {
        name:updateSchoolDto.name,
        id: Not(id),
        status:1
      }
    })
    if (exits) {
      throw new BadRequestException('Level code is already!')
    }
    if (!typeQuestion) {
      throw new NotFoundException('Level does not exits!');
    }
     const data = this.repo.merge(
      typeQuestion,
      updateSchoolDto,
    );
    return await this.repo.save(data);
  }

  async remove(id: number):Promise<TypeQuestion> {
    const typeQuestion: TypeQuestion = await this.repo.findOne({
      where: {
        id:id
      }
    });
    if (!typeQuestion) {
      throw new NotFoundException('Type question does not exits!');
    }
    return await this.repo.remove(typeQuestion)
  }

}