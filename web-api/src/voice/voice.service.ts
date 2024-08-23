import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateVoiceDto } from './dto/create-voice.dto';
import { UpdateVoiceDto } from './dto/update-voice.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Voice } from './entities/voice.entity';
import { PageOptionsDto } from 'src/utils/dtos/pageoptions-dto';
import { ItemDto, PageDto } from 'src/utils/dtos/page-dto';
import { PageMetaDto } from 'src/utils/dtos/pagemeta-dto';
import { difference } from 'src/utils/differeceArray';
import { TypeVoice } from 'src/type-voice/entities/type-voice.entity';
import e from 'express';

@Injectable()
export class VoiceService {

  constructor(
    @InjectRepository(Voice) private repo: Repository<Voice>,
    @InjectRepository(TypeVoice) private repoTypeVoice: Repository<TypeVoice>,
  ) {
  }
   async create(createVoiceDto: CreateVoiceDto): Promise<Voice> {

    return await this.repo.save(createVoiceDto);
  }

  async findAll(pageOptions: PageOptionsDto, querys: Partial<Voice>): Promise<PageDto<Voice>> {
    const queryBuilder = this.repo.createQueryBuilder('voice').where('voice.status = :status', { status: 1 }); 
    if (!!querys && Object.keys(querys).length > 0) {
      const arrayQuery = difference(Object.keys(pageOptions), Object.keys(querys))
     arrayQuery.forEach((key) => {
        if (key !== undefined && key !== null && key!='page' && key != 'take' && key != 'skip' && key != 'order') {
          queryBuilder.andWhere(`voice.${key} = :${key}`, { [key]: querys[key] });
          // queryBuilder.andWhere(`file.filetype_id = :${4}`);
        }
      });
    }

     if (pageOptions.search) {
      queryBuilder.andWhere('voice.name LIKE :name', { name: `%${pageOptions.search}%` });
    }

    queryBuilder.orderBy("voice.order", 'ASC')
      .addOrderBy("voice.createdAt", pageOptions.order)
    .skip(pageOptions.skip)
      .take(pageOptions.take);
      
      const itemCount = await queryBuilder.getCount();
      const pageMetaDto = new PageMetaDto({pageOptionsDto:pageOptions, itemCount });
    const entities = await queryBuilder.getMany();
     for (let i = 0; i < entities.length; i++){
        const typeVoice:TypeVoice = await this.repoTypeVoice.findOne({
            where: {
             id:entities[i].typeVoiceId
            }
        });
        (entities[i] as any).typeVoice = typeVoice;
      }


    return new PageDto(entities, pageMetaDto);
    
  }

   async findOne(id: number):Promise<ItemDto<Voice>>  {
    return  new ItemDto( await this.repo.findOne({
      where: {
        id: id,
        status:1
      },
    }));
  }

  async update(id: number, attrs: Partial<Voice>) {
    const voice = await this.repo.findOne({
      where: {
        id: id,
        status:1
      }
    })
    if (!voice) {
      throw new NotFoundException('Voice not found');
    }
    
    Object.assign(voice, attrs);
    return this.repo.save(voice);
  }

  async remove(id: number) {
    const voice = await this.repo.findOne({
      where: {
        id: id,
        status:1
      }
    })
    if (!voice) {
      throw new NotFoundException('voice not found');
    }
    return this.repo.remove(voice);
  }
}
