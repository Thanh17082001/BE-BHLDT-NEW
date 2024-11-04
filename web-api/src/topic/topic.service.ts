import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Topic } from './entities/topic.entity';
import { Not, Repository } from 'typeorm';
import { PageOptionsDto } from 'src/utils/dtos/pageoptions-dto';
import { PageDto } from 'src/utils/dtos/page-dto';
import { TopicDto } from './dtos/topic.dto';
import { PageMetaDto } from 'src/utils/dtos/pagemeta-dto';
import { QueryTopicDto } from './dtos/query-topic.dto';
import { CreateTopicDto } from './dtos/create-topic.dto';
import { plainToInstance } from "class-transformer";
import { transformToDto } from "../utils/transformToDto";
import { Subject } from '../subject/entities/subject.entity';
import { difference } from 'src/utils/differeceArray';
import { UpdateTopicDto } from './dtos/update-topic.dto';

@Injectable()
export class TopicService {
  constructor(
    @InjectRepository(Topic) private repo: Repository<Topic>,
    @InjectRepository(Subject) private repoSubject: Repository<Subject>,
  ) {
  }

  async create(entity: CreateTopicDto) {
    const topic: Topic = await this.repo.findOne({where:{name:entity.name}, relations:['subject']})
    const subject: Subject = await this.repoSubject.findOne({
      where: {
        id:entity.subjectId
      },
      relations: ['topics'],
    })
    if (topic && topic?.subject?.id == entity.subjectId) {
      throw new BadRequestException('topic is already!')
    }
    if (!subject) {
      throw new NotFoundException('Subject does not exits')
    }

    const cls = this.repo.create({ name: entity.name, subject });
    if (!subject.topics) {
      subject.topics = [];
    }
    subject.topics.push(cls)
    
    // const newTopic =  await this.repo.save({ name: entity.name, subject });
    await this.repoSubject.save(subject);
    return cls;
  }

  async find(gradeQuery: QueryTopicDto, pageOptionsDto: PageOptionsDto): Promise<PageDto<Topic>> {
      const queryBuilder = this.repo.createQueryBuilder('topic').leftJoinAndSelect('topic.subject', 'subject').leftJoinAndSelect('subject.grade', 'grade')
    if (!!gradeQuery && Object.keys(gradeQuery).length > 0) {
      const arrayQuery = difference(Object.keys(pageOptionsDto), Object.keys(gradeQuery))
      console.log(arrayQuery);
      arrayQuery.forEach((key) => {
        if (key !== undefined && key !== null) {
          queryBuilder.andWhere(`subject.${key} = :${key}`, { [key]: gradeQuery[key] });
        }
      });
    }

     if (pageOptionsDto.search) {
      queryBuilder.andWhere('topic.name LIKE :name', { name: `%${pageOptionsDto.search}%` });
    }

    queryBuilder.orderBy("subject.createdAt", pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    const itemCount = await queryBuilder.getCount();
    const pageMetaDto = new PageMetaDto({ pageOptionsDto: pageOptionsDto, itemCount });
    const entities = await queryBuilder.getMany();

    return new PageDto(entities, pageMetaDto);
  }

  findOne(id: number) {
    return this.repo.findOne({
      where: {
        id: id
      },
      relations:['subject']
    });
  }

  async update(id: number, attrs: Partial<UpdateTopicDto>) {
   const topic: Topic =  await this.repo.findOne({
      where: { id: id },
      relations: ['subject'],
   });
    
    const topic2: Topic =  await this.repo.findOne({
      where: { id: Not(id), name:attrs.name },
      relations: ['subject'],
    });
    console.log(topic2);
    const subject = await this.repoSubject.findOne({ where: { id: +attrs.subjectId } });
    if (!topic) {
      throw new NotFoundException('topic not found');
    }
    if (!subject) {
      throw new NotFoundException('Subject not found');
    }

    if (topic2 && topic2?.subject?.id == attrs.subjectId) {
      throw new BadRequestException('topic is already!')
    }
   
    topic.subject = subject;
    const data = this.repo.merge(
      topic,
      attrs,
    );
    return await this.repo.save(data);
  }

  async remove(id: number) {
    const topic = await this.repo.findOne({
      where: { id: id },
    });

    if (!topic) {
      throw new NotFoundException(`Class with ID ${id} not found`);
    }

    // Delete the topic, related classes will be deleted automatically due to cascade
    return await this.repo.remove(topic);
  }

  findOneByTopicName(name: string, subject_id: number) {
    return this.repo.findOneBy({ name });
  }
  
}