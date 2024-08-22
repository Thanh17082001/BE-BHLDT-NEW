import { BookService } from './../book/book.service';
import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateLessonPlanDto } from './dto/create-lesson-plan.dto';
import { UpdateLessonPlanDto } from './dto/update-lesson-plan.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { LessonPlan } from './entities/lesson-plan.entity';
import { Repository } from 'typeorm';
import { LessonPlanInterFace } from './interface/lesson-plan.interface';
import { PageOptionsDto } from 'src/utils/dtos/pageoptions-dto';
import { ItemDto, PageDto } from 'src/utils/dtos/page-dto';
import { difference } from 'src/utils/differeceArray';
import { PageMetaDto } from 'src/utils/dtos/pagemeta-dto';
import { Book } from 'src/book/entities/book.entity';
import { Subject } from 'src/subject/entities/subject.entity';

import * as path  from 'path';
import * as fs from 'fs';

@Injectable()
export class LessonPlanService {
  constructor(
    @InjectRepository(LessonPlan) private repo: Repository<LessonPlan>,
    @InjectRepository(Subject) private readonly subjectRepo: Repository<Subject>,
  ) {
  }
  async create(createLessonPlan: Partial<CreateLessonPlanDto>): Promise<LessonPlanInterFace> {
    const { name, path, linkImage, subjectId, topic, fileType, previewImage } = createLessonPlan;
   const subject = await this.subjectRepo.findOne({ where: { id: subjectId } });
    if (!subject) {
      throw new NotFoundException('subject not found');
    }
    return await this.repo.save({
      name,
      previewImage,
      path,
      linkImage,
      subjectId, 
      topic,
      fileType
    });
  }

  async findAll(pageOptions : PageOptionsDto, querys: Partial<LessonPlanInterFace>): Promise<PageDto<LessonPlanInterFace>> {
    const queryBuilder = this.repo.createQueryBuilder('lesson-plan')
    if (!!querys && Object.keys(querys).length > 0) {
      const arrayQuery = difference(Object.keys(pageOptions), Object.keys(querys))
     arrayQuery.forEach((key) => {
        if (key !== undefined && key !== null ) {
          queryBuilder.andWhere(`lesson-plan.${key} = :${key}`, { [key]: querys[key] });
        }
      });
    }

     if (pageOptions.search) {
      queryBuilder.andWhere('lesson-plan.name LIKE :name', { name: `%${pageOptions.search}%` });
    }

    queryBuilder.orderBy("lesson-plan.createdAt", pageOptions.order)
    .skip(pageOptions.skip)
      .take(pageOptions.take);
      
      const itemCount = await queryBuilder.getCount();
      const pageMetaDto = new PageMetaDto({pageOptionsDto:pageOptions, itemCount });
    const entities  = await queryBuilder.getMany();

    return new PageDto(entities, pageMetaDto);
    
  }
  

  async findOne(id: number):Promise<ItemDto<LessonPlanInterFace>> {
    return new ItemDto( await this.repo.findOne({
      where: {
        id: id,
      },
    }))
  }

  async update(id: number, updateSchoolDto: Partial<UpdateLessonPlanDto>): Promise<LessonPlanInterFace> {
    const typeLib: LessonPlanInterFace = await this.repo.findOne({
      where: {
        id: id,
      },
    })
    if (!typeLib) {
      throw new NotFoundException('user not found');
    }
     const data = this.repo.merge(
      typeLib,
      updateSchoolDto,
    );
    return await this.repo.save(data);
  }

 async remove(id: number):Promise<LessonPlanInterFace> {
    const lessonPlan = await this.repo.findOne({ where: { id: id } });

    if (!lessonPlan) {
      throw new NotFoundException(`LessonPlanInterFace with ID ${id} not found`);
   }
   const result = await this.repo.remove(lessonPlan)
   
    const pttPathOld = path.join(__dirname, '..', '..', '/public', lessonPlan?.path);
    fs.unlinkSync(pttPathOld);

    // Delete the lessonPlan
    return result;
  }
}