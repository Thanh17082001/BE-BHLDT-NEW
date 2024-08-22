import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Subject } from './entities/subject.entity';
import { Not, Repository } from 'typeorm';
import { PageOptionsDto } from 'src/utils/dtos/pageoptions-dto';
import { ItemDto, PageDto } from 'src/utils/dtos/page-dto';
import { SubjectDto } from './dtos/subject.dto';
import { PageMetaDto } from 'src/utils/dtos/pagemeta-dto';
import { QuerySubjectDto } from './dtos/query-subject.dto';
import { CreateSubjectDto } from './dtos/create-subject.dto';
import { plainToInstance } from "class-transformer";
import { transformToDto } from "../utils/transformToDto";
import { GradeService } from 'src/grade/grade.service';
import { Grade } from 'src/grade/entities/grade.entity';
import { difference } from 'src/utils/differeceArray';
import { UpdateSubjectDto } from './dtos/update-subject.dto';

@Injectable()
export class SubjectService {
  constructor(
    @InjectRepository(Subject) private repo: Repository<Subject>,
    @InjectRepository(Grade) private repoGrade: Repository<Grade>,
    private gradeService: GradeService,
  ) {
  }

  async create(entity: CreateSubjectDto) {
    const exits: Subject = await this.repo.findOne({
      where: {
        name:entity.name
      }
    })
    if (exits) {
      throw new BadRequestException('Subject is already!')
    }
    const grade: Grade = await this.gradeService.findOne(entity.grade_id)
    const cls = this.repo.create({ name:entity.name, grade });
    if (!grade.subjects) {
      grade.subjects = [];
    }
    grade.subjects.push(cls)
    const subjectEntity = await this.repo.save({
      name: entity.name,
      grade:grade
    });
    return subjectEntity;
  }

  async find(subjectQuery: QuerySubjectDto, pageOptionsDto: PageOptionsDto): Promise<PageDto<Subject>> {
   const queryBuilder = this.repo.createQueryBuilder('subject').leftJoinAndSelect('subject.grade', 'grade').leftJoinAndSelect('subject.topics', 'topic').where('subject.status = :status', { status: 1 }); 
    if (!!subjectQuery && Object.keys(subjectQuery).length > 0) {
      const arrayQuery = difference(Object.keys(pageOptionsDto), Object.keys(subjectQuery))
      console.log(arrayQuery);
     arrayQuery.forEach((key) => {
        if (key !== undefined && key !== null ) {
          queryBuilder.andWhere(`subject.${key} = :${key}`, { [key]: subjectQuery[key] });
        }
      });
    }

     if (pageOptionsDto.search) {
      queryBuilder.andWhere('subject.name LIKE :name', { name: `%${pageOptionsDto.search}%` });
    }

    queryBuilder.orderBy("subject.createdAt", pageOptionsDto.order)
    .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);
      
      const itemCount = await queryBuilder.getCount();
      const pageMetaDto = new PageMetaDto({pageOptionsDto:pageOptionsDto, itemCount });
    const  entities  = await queryBuilder.getMany();

    return new PageDto(entities, pageMetaDto);
  }

  async findOne(id: number): Promise<ItemDto<Subject>> {
    return new ItemDto(await this.repo
      .createQueryBuilder('subject')
      .leftJoinAndSelect('subject.grade', 'grade')
      .leftJoinAndSelect('subject.topics', 'topics')
      .where('subject.id = :id', { id })
      .getOne())
  }
  

  async update(id: number, updateSubjectDto: UpdateSubjectDto) {
   const subject: Subject = await this.repo
      .createQueryBuilder('subject')
      .leftJoinAndSelect('subject.grade', 'grade')
      .leftJoinAndSelect('subject.topics', 'topics')
      .where('subject.id = :id', { id })
      .getOne();
    const { name } = updateSubjectDto;
    const exits = await this.repo.findOne({
      where: {
        name,
        id: Not(id),
        status:1
      }
    })
    const grade: Grade = await this.gradeService.findOne(updateSubjectDto.grade_id)
    if (exits) {
      throw new BadRequestException('Subject code is already!')
    }
    if (!subject) {
      throw new NotFoundException('Subject does not exits!');
    }
    if (!grade) {
      throw new NotFoundException('Grade does not exits!');
    }
    subject.grade = grade;
     const data = this.repo.merge(
      subject,
      updateSubjectDto,
    );
    return await this.repo.save(data);
  }

  async remove(id: number) {
    const subject = await this.repo.findOne({
      where: { id: id },
    });

    if (!subject) {
      throw new NotFoundException(`Class with ID ${id} not found`);
    }

    // Delete the subject, related classes will be deleted automatically due to cascade
    return await this.repo.remove(subject);
  }
  findOneBySubjectName(name: string) {
    return this.repo.findOne({
      where: {
        name: name
      }
    });
  }
}
