import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTypeVoiceDto } from './dto/create-type-voice.dto';
import { UpdateTypeVoiceDto } from './dto/update-type-voice.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeVoice } from './entities/type-voice.entity';
import { Not, Repository } from 'typeorm';
import { PageOptionsDto } from 'src/utils/dtos/pageoptions-dto';
import { ItemDto, PageDto } from 'src/utils/dtos/page-dto';
import { difference } from 'src/utils/differeceArray';
import { PageMetaDto } from 'src/utils/dtos/pagemeta-dto';

@Injectable()
export class TypeVoiceService {
  constructor(
    @InjectRepository(TypeVoice) private repo: Repository<TypeVoice>,
  ) {
  }
  async create(createTypeQuestionDto: CreateTypeVoiceDto): Promise<TypeVoice> {
    const exits = await this.repo.findOne({
      where: {
        name:createTypeQuestionDto.name,
      }
    })
    if (exits) {
      throw new BadRequestException('Type voice  is already!')
    }

    return await this.repo.save(createTypeQuestionDto);
  }

  
  async findAll( pageOptions : PageOptionsDto, query: Partial<TypeVoice>): Promise<PageDto<TypeVoice>> {
    const queryBuilder = this.repo.createQueryBuilder('type-voice').where('type-voice.status = :status', { status: 1 }); 
    if (!!query && Object.keys(query).length > 0) {
      const arrayQuery = difference(Object.keys(pageOptions), Object.keys(query))
     arrayQuery.forEach((key) => {
        if (key !== undefined && key !== null && key!='page' && key != 'take' && key != 'skip' && key != 'order' ) {
          queryBuilder.andWhere(`type-voice.${key} = :${key}`, { [key]: query[key] });
        }
      });
    }

     if (pageOptions.search) {
      queryBuilder.andWhere('type-voice.name LIKE :name', { name: `%${pageOptions.search}%` });
    }

    queryBuilder.orderBy("type-voice.createdAt", pageOptions.order)
    .skip(pageOptions.skip)
      .take(pageOptions.take);
      
      const itemCount = await queryBuilder.getCount();
      const pageMetaDto = new PageMetaDto({pageOptionsDto:pageOptions, itemCount });
    const entities = await queryBuilder.getMany();

    return new PageDto(entities, pageMetaDto);
    
  }
  

  async findOne(id: number): Promise<ItemDto<TypeVoice>> {
    return new ItemDto (await this.repo.findOne({
      where: {
        id:id
      }
    }))
  }

  async update(id: number, updateTypeScore: Partial<UpdateTypeVoiceDto>): Promise<TypeVoice> {
    const typeQuestion: TypeVoice = await this.repo.findOne({
      where: {
        id:id
      }
    });
    const exits = await this.repo.findOne({
      where: {
        name:updateTypeScore.name,
        id: Not(id),
        status:1
      }
    })
    if (exits) {
      throw new BadRequestException('Type voice  is already!')
    }
    if (!typeQuestion) {
      throw new NotFoundException('Type voice does not exits!');
    }
     const data = this.repo.merge(
      typeQuestion,
      updateTypeScore,
    );
    return await this.repo.save(data);
  }

  async remove(id: number):Promise<TypeVoice> {
    const typeQuestion: TypeVoice = await this.repo.findOne({
      where: {
        id:id
      }
    });
    if (!typeQuestion) {
      throw new NotFoundException('Type voice does not exits!');
    }
    return await this.repo.remove(typeQuestion)
  }

}

