import { School } from 'src/school/entities/school.entity';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Not, Repository } from 'typeorm';
import { PageDto } from 'src/utils/dtos/page-dto';
import { PageOptionsDto } from 'src/utils/dtos/pageoptions-dto';
import { PageMetaDto } from 'src/utils/dtos/pagemeta-dto';
import { difference, differenceArrayOB } from 'src/utils/differeceArray';
import { SchoolInterface } from './interface/school.interface';
import { AddGradesDto } from './dto/add-grade-scholl';
import { Grade } from 'src/grade/entities/grade.entity';
import { SearchDto } from './dto/search-dto';

@Injectable()
export class SchoolService {
  constructor(
    @InjectRepository(School) private repo: Repository<School>,
    @InjectRepository(Grade) private readonly gradeRepository: Repository<Grade>,
  ) {
  }
  async create(createSchoolDto: CreateSchoolDto): Promise<SchoolInterface> {
    const { code } = createSchoolDto;
    const exits = await this.repo.findOne({
      where: {
        code,
        status:1
      }
    })
    if (exits) {
      throw new BadRequestException('School code is already!')
    }
    return await this.repo.save(createSchoolDto);
  }

  async addgrades(addGradesDto: AddGradesDto): Promise<SchoolInterface>{
    const { id, grades} = addGradesDto;
    const gradesData: Array<Grade> = []
    
    for (let i = 0; i < grades.length; i++){
      const grade: Grade = await this.gradeRepository.findOne({
        where:{id:Number(grades[i])}
      })
      if (grade) {
        gradesData.push(grade)
      }
      else {
        throw new BadRequestException('Id grade is not found')
      }
    }
   const school: School = await this.repo.findOne({
        where: { id: Number(id) },
        relations: ['grades']
    });
    
    if (gradesData.length<=0) {
      throw new BadRequestException(' Grades is not empty')
    }
    school.grades = differenceArrayOB([...school.grades, ...gradesData]);
    return this.repo.save(school)
  }

  async findAll( pageOptions : PageOptionsDto, querySchol: Partial<SchoolInterface>): Promise<PageDto<SchoolInterface>> {
    const queryBuilder = this.repo.createQueryBuilder('school').leftJoinAndSelect('school.grades', 'grades') .where('school.status = :status', { status: 1 }); 
    if (!!querySchol && Object.keys(querySchol).length > 0) {
      const arrayQuery = difference(Object.keys(pageOptions), Object.keys(querySchol))
     arrayQuery.forEach((key) => {
        if (key !== undefined && key !== null ) {
          queryBuilder.andWhere(`school.${key} = :${key}`, { [key]: querySchol[key] });
        }
      });
    }

     if (pageOptions.search) {
      queryBuilder.andWhere('school.name LIKE :name', { name: `%${pageOptions.search}%` });
    }

    queryBuilder.orderBy("school.createdAt", pageOptions.order)
    .skip(pageOptions.skip)
      .take(pageOptions.take);
      
      const itemCount = await queryBuilder.getCount();
      const pageMetaDto = new PageMetaDto({pageOptionsDto:pageOptions, itemCount });
    const  entities  = await queryBuilder.getMany();

    return new PageDto(entities, pageMetaDto);
    
  }
  

  async findOne(id: number): Promise<School> {
    return this.repo.findOne({
      where: {
        id:id
      }
    })
  }

  async update(id: number, updateSchoolDto: Partial<UpdateSchoolDto>): Promise<School> {
    const typeLib: School = await this.findOne(id);
    const { code } = updateSchoolDto;
    const exits = await this.repo.findOne({
      where: {
        code,
        id: Not(id),
        status:1
      }
    })
    if (exits) {
      throw new BadRequestException('School code is already!')
    }
    if (!typeLib) {
      throw new NotFoundException('school does not exits!');
    }
     const data = this.repo.merge(
      typeLib,
      updateSchoolDto,
    );
    return await this.repo.save(data);
  }

  // async remove(id: number):Promise<School> {
  //   const school: School = await this.findOne(id);
  //   if (!school) {
  //     throw new NotFoundException('school does not exits!');
  //   }
  //    const data = this.repo.merge(
  //     school,
  //     {status:0},
  //   );
  //   return await this.repo.save(data);
  // }

  async remove(id: number):Promise<School> {
    const school = await this.repo.findOne({ where: { id: id }, relations: ['grades', 'grades.classes'] });

    if (!school) {
      throw new NotFoundException(`School with ID ${id} not found`);
    }

    // Delete the school
    return await this.repo.remove(school);
  }

}

