import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Class } from './entities/class.entity';
import { Repository } from 'typeorm';
import { Grade } from 'src/grade/entities/grade.entity';
import { PageOptionsDto } from 'src/utils/dtos/pageoptions-dto';
import { ItemDto, PageDto } from 'src/utils/dtos/page-dto';
import { difference } from 'src/utils/differeceArray';
import { PageMetaDto } from 'src/utils/dtos/pagemeta-dto';
import { SchoolYear } from 'src/school-year/entities/school-year.entity';

@Injectable()
export class ClassService {
  constructor(
    @InjectRepository(Class) private repo: Repository<Class>,
    @InjectRepository(Grade) private readonly gradeRepository: Repository<Grade>,
    @InjectRepository(SchoolYear) private readonly schoolYearRepository: Repository<SchoolYear>,
  ) {
  }
  async create(createClassDto: Partial<CreateClassDto>): Promise<Class> {
    const { name, gradeId, schoolYearId, suffixes } = createClassDto;
    const grade = await this.gradeRepository.findOne({ where: { id: +gradeId } });
    const exitsClass = await this.repo.findOne(
      {
        where: {
          name: name,
          suffixes
        }
      }
    )
    const schoolYear = await this.schoolYearRepository.findOne({ where: { id: +schoolYearId } });
    if (exitsClass && grade.id == gradeId && schoolYear.id == schoolYearId) {
      throw new BadRequestException('Class is already !')
    }
    if (!grade) {
      throw new NotFoundException('grade not found');
    }
    if (!schoolYear) {
      throw new NotFoundException('schoolYear not found');
    }

    const cls = this.repo.create({ name, grade, suffixes, schoolYear });
    if (!grade.classes) {
      grade.classes = [];
    }
    grade.classes.push(cls)
    return await this.repo.save({
      name,
      grade,
      suffixes,
      schoolYear
    });
  }

  async findAll(pageOptions: PageOptionsDto, querySchol: Partial<Class>): Promise<PageDto<Class>> {
    const queryBuilder = this.repo.createQueryBuilder('class').leftJoinAndSelect('class.grade', 'grade').leftJoinAndSelect('class.schoolYear', 'school-year').leftJoinAndSelect('grade.school', 'school')
    if (!!querySchol && Object.keys(querySchol).length > 0) {
      const arrayQuery = difference(Object.keys(pageOptions), Object.keys(querySchol))
      arrayQuery.forEach((key) => {
        if (key !== undefined && key !== null && key!='page' && key != 'take' && key != 'skip' && key != 'order') {
          console.log(key);
          queryBuilder.andWhere(`class.${key} = :${key}`, { [key]: querySchol[key] });
        }
      });
    }
    if (pageOptions.search) {
      queryBuilder.andWhere('class.name LIKE :name', { name: `%${pageOptions.search}%` });
    }

    queryBuilder.orderBy("class.createdAt", pageOptions.order)
      .orderBy('grade.name', 'ASC')
      .skip(pageOptions.skip)
      .take(pageOptions.take);

    const itemCount = await queryBuilder.getCount();
    const pageMetaDto = new PageMetaDto({ pageOptionsDto: pageOptions, itemCount });
    const entities = await queryBuilder.getMany();

    return new PageDto(entities, pageMetaDto);

  }


  async findOne(id: number): Promise<ItemDto<Class>>{

    const classOfSchool:Class = await this.repo
      .createQueryBuilder('class')
      .leftJoinAndSelect('class.grade', 'grade')
      .leftJoinAndSelect('class.schoolYear', 'schoolYear')
      .leftJoinAndSelect('grade.school', 'school')
      .where('class.id = :id', { id })
      .getOne();

    return  new ItemDto(classOfSchool);
    
  }

  async update(id: number, updateClassDto: Partial<UpdateClassDto>): Promise<Class> {
    const typeLib: Class = await this.repo.findOne({
      where: {
        id: id,
      },
      relations: ['grade'],
    });
    const grade = await this.gradeRepository.findOne({ where: { id: +updateClassDto.gradeId } });
    const schoolYear = await this.schoolYearRepository.findOne({ where: { id: +updateClassDto.schoolYearId } });
    if (!typeLib) {
      throw new NotFoundException('user not found');
    }
    if (!grade) {
      throw new NotFoundException('grade not found');
    }
    if (!schoolYear) {
      throw new NotFoundException('schoolYear not found');
    }
    typeLib.schoolYear = schoolYear;
    typeLib.grade = grade;
    const data = this.repo.merge(
      typeLib,
      updateClassDto,
    );
    return await this.repo.save(data);
  }

   async remove(id: number):Promise<Class> {
      const classEntity = await this.repo.findOne({
      where: { id: id },
    });

    if (!classEntity) {
      throw new NotFoundException(`Class with ID ${id} not found`);
    }

    // Delete the classEntity, related classes will be deleted automatically due to cascade
    return await this.repo.remove(classEntity);
  }
}