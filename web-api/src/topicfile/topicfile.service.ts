import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TopicFile } from './entities/topicfile.entity';
import { Repository } from 'typeorm';
import { PageOptionsDto } from 'src/utils/dtos/pageoptions-dto';
import { PageDto } from 'src/utils/dtos/page-dto';
import { TopicFileDto } from './dtos/topicfile.dto';
import { PageMetaDto } from 'src/utils/dtos/pagemeta-dto';
import { QueryTopicFileDto } from './dtos/query-topicfile.dto';
import { CreateTopicFileDto } from './dtos/create-topicfile.dto';
import { plainToInstance } from "class-transformer";
import { transformToDto } from "../utils/transformToDto";

@Injectable()
export class TopicFileService {
  constructor(
    @InjectRepository(TopicFile) private repo: Repository<TopicFile>) {
  }

  async create(entity: CreateTopicFileDto) {

    const grade = this.repo.create(entity);
    const gradeEntity = await this.repo.save(grade);
    return gradeEntity;
  }

  async find(gradeQuery: QueryTopicFileDto, pageOptionsDto: PageOptionsDto): Promise<PageDto<TopicFileDto>> {
    const queryBuilder = this.repo.createQueryBuilder("grade");
    if (gradeQuery.name) {
      let nameQuery = gradeQuery.name;
      console.log("name query ", nameQuery);
      queryBuilder.where("grade.name = :name", { name: nameQuery });
    }

    console.log("pageOptionsDto.skip", pageOptionsDto.skip);
    console.log("pageOptionsDto.take", pageOptionsDto.take);

    await queryBuilder.orderBy("grade.createdAt", pageOptionsDto.order).skip(pageOptionsDto.skip).take(pageOptionsDto.take);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({ pageOptionsDto, itemCount });

    console.log("find all grades - entities 22", entities);
    console.log("find all grades - itemCount", itemCount);
    const grades = transformToDto(TopicFileDto, entities) as TopicFileDto[];
    console.log('transform', grades);

    return new PageDto(grades, pageMetaDto);
  }

  findOne(id: number) {
    return this.repo.findOne({
      where: {
        id: id
      }
    });
  }

  async update(id: number, attrs: Partial<TopicFile>) {
    const grade = await this.findOne(id);
    if (!grade) {
      throw new NotFoundException('grade not found');
    }
    if (attrs.id !== id) {
      throw new NotFoundException('grade not found');
    }
    Object.assign(grade, attrs);
    return this.repo.save(grade);
  }

  async remove(id: number) {
    const grade = await this.findOne(id);
    if (!grade) {
      throw new NotFoundException('grade not found');
    }
    return this.repo.remove(grade);
  }
  findOneByTopicFilename(name: string) {
    return this.repo.findOne({
      where: {
        name: name
      }
    });
  }

}
