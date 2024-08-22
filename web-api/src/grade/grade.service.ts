import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Grade } from './entities/grade.entity';
import { Repository } from 'typeorm';
import { PageOptionsDto } from 'src/utils/dtos/pageoptions-dto';
import { PageDto } from 'src/utils/dtos/page-dto';
import { GradeDto } from './dtos/grade.dto';
import { PageMetaDto } from 'src/utils/dtos/pagemeta-dto';
import { QueryGradeDto } from './dtos/query-grade.dto';
import { CreateGradeDto } from './dtos/create-grade.dto';
import { plainToInstance } from "class-transformer";
import { transformToDto } from "../utils/transformToDto";
import { School } from 'src/school/entities/school.entity';
import { UpdateGradeDto } from './dtos/update-grade.dto';

@Injectable()
export class GradeService {
  constructor(
    @InjectRepository(Grade) private repo: Repository<Grade>,
    @InjectRepository(School) private repoSchool: Repository<School>
  ) {
  }

  async create(entity: CreateGradeDto) {
    const school: School = await this.repoSchool.findOne({ where: { id: entity.schoolId } })
    if (!school) {
      throw new BadRequestException('School is Already exits!');
    }

    const grade = this.repo.create({
      ...entity,
      school:school
    });
    const gradeEntity = await this.repo.save(grade);
    return gradeEntity;
  }

  async find(gradeQuery: QueryGradeDto, pageOptionsDto: PageOptionsDto): Promise<PageDto<GradeDto>> {
    const queryBuilder = this.repo.createQueryBuilder("grade").leftJoinAndSelect('grade.classes','class').leftJoinAndSelect('grade.school','school').where('grade.status = :status', { status: 1 });;
    if (pageOptionsDto.search) {
     console.log(pageOptionsDto);
      queryBuilder.andWhere('grade.name LIKE :name', { name: `%${pageOptionsDto.search}%` });
    }

    await queryBuilder.orderBy("grade.createdAt", pageOptionsDto.order).skip(pageOptionsDto.skip).take(pageOptionsDto.take);

    queryBuilder.orderBy("grade.createdAt", pageOptionsDto.order)
    .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);
      
      const itemCount = await queryBuilder.getCount();
      const pageMetaDto = new PageMetaDto({pageOptionsDto:pageOptionsDto, itemCount });
    const  entities  = await queryBuilder.getMany();

    return new PageDto(entities, pageMetaDto);
  }

  async findOne(id: number) {
    return await this.repo.findOne({
      where: {
        id: id,
        status:1
      },
      relations:['classes', 'school']
    });;
  }

  async update(id: number, updateGradeDto: Partial<UpdateGradeDto>): Promise<Grade> {
    const typeGrade: Grade = await this.findOne(id);
    const school :School = await this.repoSchool.findOne({
      where:{
        id:updateGradeDto.schoolId
      }
    })
    typeGrade.school = school;
     const data = this.repo.merge(
      typeGrade,
      updateGradeDto,
    );
    return await this.repo.save(data);
  }

//  async remove(id: number):Promise<Grade> {
//     const grade: Grade = await this.findOne(id);
//     if (!grade) {
//       throw new NotFoundException('grade does not exits!');
//     }
//      const data = this.repo.merge(
//       grade,
//       {status:0},
//     );
//     return await this.repo.save(data);
  //   }
  
  async remove(id: number):Promise<Grade> {
      const grade = await this.repo.findOne({
      where: { id: id },
      relations: ['classes'],
    });

    if (!grade) {
      throw new NotFoundException(`Grade with ID ${id} not found`);
    }

    // Delete the grade, related classes will be deleted automatically due to cascade
    return await this.repo.remove(grade);
  }

  findOneByGradename(name: string) {
    return this.repo.findOne({
      where: {
        name: name
      }
    });
  }

}
