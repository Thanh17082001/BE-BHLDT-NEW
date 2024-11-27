import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { PageOptionsDto } from 'src/utils/dtos/pageoptions-dto';
import { ItemDto, PageDto } from 'src/utils/dtos/page-dto';
import { difference } from 'src/utils/differeceArray';
import { PageMetaDto } from 'src/utils/dtos/pagemeta-dto';
import { Part } from './entities/part.entity';
import { CreatePartDto } from './dto/create-part.dto';
import { UpdatePartDto } from './dto/update-part.dto';

@Injectable()
export class PartService {
  constructor(
    @InjectRepository(Part) private repo: Repository<Part>,
  ) {
  }
  async create(createTypeQuestionDto: CreatePartDto): Promise<Part> {
    const exits = await this.repo.findOne({
      where: {
        name: createTypeQuestionDto.name,
      }
    })
    if (exits) {
      throw new BadRequestException('Part is already!')
    }

    return await this.repo.save(createTypeQuestionDto);
  }


  async findAll(pageOptions: PageOptionsDto, query: Partial<Part>): Promise<PageDto<Part>> {
    const queryBuilder = this.repo.createQueryBuilder('type-score').where('type-score.status = :status', { status: 1 });
    if (!!query && Object.keys(query).length > 0) {
      const arrayQuery = difference(Object.keys(pageOptions), Object.keys(query))
      arrayQuery.forEach((key) => {
        if (key !== undefined && key !== null && key != 'page' && key != 'take' && key != 'skip' && key != 'order') {
          queryBuilder.andWhere(`type-score.${key} = :${key}`, { [key]: query[key] });
        }
      });
    }

    if (pageOptions.search) {
      queryBuilder.andWhere('type-score.name LIKE :name', { name: `%${pageOptions.search}%` });
    }

    queryBuilder.orderBy("type-score.createdAt", pageOptions.order)
      .skip(pageOptions.skip)
      .take(pageOptions.take);

    const itemCount = await queryBuilder.getCount();
    const pageMetaDto = new PageMetaDto({ pageOptionsDto: pageOptions, itemCount });
    const entities = await queryBuilder.getMany();

    return new PageDto(entities, pageMetaDto);

  }


  async findOne(id: number): Promise<ItemDto<Part>> {
    return new ItemDto(await this.repo.findOne({
      where: {
        id: id
      }
    }))
  }

  async update(id: number, updatePart: Partial<UpdatePartDto>): Promise<Part> {
    const typeQuestion: Part = await this.repo.findOne({
      where: {
        id: id
      }
    });
    const exits = await this.repo.findOne({
      where: {
        name: updatePart.name,
        id: Not(id),
        status: 1
      }
    })
    if (exits) {
      throw new BadRequestException('Type score  is already!')
    }
    if (!typeQuestion) {
      throw new NotFoundException('Type score does not exits!');
    }
    const data = this.repo.merge(
      typeQuestion,
      updatePart,
    );
    return await this.repo.save(data);
  }

  async remove(id: number): Promise<Part> {
    const typeQuestion: Part = await this.repo.findOne({
      where: {
        id: id
      }
    });
    if (!typeQuestion) {
      throw new NotFoundException('Type score does not exits!');
    }
    return await this.repo.remove(typeQuestion)
  }

}
