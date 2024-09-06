import { query } from 'express';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Student } from './entities/student.entity';
import { Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Class } from 'src/class/entities/class.entity';
import { User } from 'src/user/entities/user.entity';
import { PageOptionsDto } from 'src/utils/dtos/pageoptions-dto';
import { ItemDto, PageDto } from 'src/utils/dtos/page-dto';
import { difference } from 'src/utils/differeceArray';
import { PageMetaDto } from 'src/utils/dtos/pagemeta-dto';
import { CreateProfileDto } from 'src/profile/dtos/create-profile.dto';
import { Profile } from 'src/profile/entities/profile.entity';
import { ProfileService } from 'src/profile/profile.service';
import { TypeScoreService } from 'src/score/score.service';
import { QueryDto } from './dto/query';
import { Score } from 'src/score/entities/score.entity';
import {scoreAverage} from 'src/utils/score-avg';
import { PromotedDto } from 'src/score/dto/promoted-dto';
import { TypeScore } from 'src/type-score/entities/type-score.entity';

type ScoresByType = {
  [key: string]: Score[];
};
@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Class) private repoClass: Repository<Class>,
   
    @InjectRepository(Student) private readonly repo: Repository<Student>,
    @InjectRepository(TypeScore) private readonly repoTypeScore: Repository<TypeScore>,
    @InjectRepository(Score) private readonly scoreRepository: Repository<Score>,
    private profileService: ProfileService,
  ) {
  }
  async create(createstudenDto: Partial<CreateStudentDto>, createProfileDto:CreateProfileDto): Promise<Student> {
    const { classId} = createstudenDto;
   const classOfStudent = await this.repoClass.findOne({ where: { id: +classId } });
    const profile = await this.profileService.create(createProfileDto)
    if (!classOfStudent) {
      throw new NotFoundException('class not found');
    }
     
    return this.repo.save({  classId:classOfStudent.id || null, profile:profile });
  }



  async findAll(pageOptions: PageOptionsDto, querySchol: Partial<Student>, queryScore: QueryDto): Promise<PageDto<Student>> {
    const queryBuilder = this.repo.createQueryBuilder('student').leftJoinAndSelect('student.profile', 'profile')
    if (!!querySchol && Object.keys(querySchol).length > 0) {
      const arrayQuery = difference(Object.keys(pageOptions), Object.keys(querySchol))
      arrayQuery.forEach((key) => {
        if (key !== undefined && key !== null ) {
          queryBuilder.andWhere(`student.${key} = :${key}`, { [key]: querySchol[key] });
        }
      });
    }

     if (pageOptions.search) {
      queryBuilder.andWhere('profile.fullname LIKE :fullname', { fullname: `%${pageOptions.search}%` });
    }

    queryBuilder.orderBy("student.createdAt", pageOptions.order)
    .skip(pageOptions.skip)
      .take(pageOptions.take);
      
      const itemCount = await queryBuilder.getCount();
      const pageMetaDto = new PageMetaDto({pageOptionsDto:pageOptions, itemCount });
    const entities = await queryBuilder.getMany();
    // cả năm
    if (!queryScore.typeScoreId) {
      const typeScopes = await this.repoTypeScore.find()
      for (let i = 0; i < entities.length; i++){
        const scores:Score[] = await this.scoreRepository.find({
            where: {
              studentId: +entities[i].id || 0,
              classId: +queryScore.classId || 0,
              schoolYearId: +queryScore.schoolYearId || 0,
              subjectId: +queryScore.subjectId || 0,
              // typeScoreId: +queryScore.typeScoreId || undefined,
            }
        });
        // get score by typeScore and swap to array 
        const scoresByType = typeScopes.reduce<ScoresByType>((acc, typeScore) => {
          acc[typeScore.name] = scores.filter(score => score.typeScoreId === typeScore.id);
          return acc;
        }, {});
        const scoresTotal =[]
        for (let k = 0; k < typeScopes.length; k++) {
          const total = scoreAverage(scoresByType[typeScopes[k].name])
          scoresTotal.push({
            score: total,
            coefficient: typeScopes[k].coefficient,
            name: typeScopes[k].name
          })
        }
        const totalAVG = scoreAverage(scoresTotal);
        (entities[i] as any).avg = scoresTotal;
        (entities[i] as any).totalAVG = totalAVG || 0 ;
      }
    }
    // từng học kỳ
    else {
      for (let i = 0; i < entities.length; i++){
        const scores:Score[] = await this.scoreRepository.find({
            where: {
              studentId: +entities[i].id || 0,
              classId: +queryScore.classId || 0,
              schoolYearId: +queryScore.schoolYearId || 0,
              subjectId: +queryScore.subjectId || 0,
              typeScoreId: +queryScore.typeScoreId || undefined,
            }
        });
        
  
        const totalScore = scoreAverage(scores);
        (entities[i] as any).scores = scores;
        (entities[i] as any).scoreAvg = totalScore || 0 ;
      }
    }
    return new PageDto(entities, pageMetaDto);
    
  }

  async findOne(id: number): Promise<ItemDto<Student>> {
    const student = await this.repo.findOne({
      where: {
        id: id,
      },
      relations: ['profile'],
    })
    const scores = await this.scoreRepository.find({
          where: {
            studentId: +student.id || 0,
            classId: +student.classId || 0,
            
          }
       });
      (student as any).scores = scores ;
    return new ItemDto(student)
  }

  async update(id: number, updateClassDto: Partial<UpdateStudentDto>, dataProfile:Partial<CreateProfileDto>): Promise<Student> {
    const student: Student = await this.repo.findOne({
      where: {
        id: id,
      },
      relations: ['profile'],
    }); 
      const {classId} = updateClassDto;
    const classOfStudent = await this.repoClass.findOne({ where: { id: +classId } });
    if (!classOfStudent) {
      throw new NotFoundException('class not found');
    }
    
    if (!student) {
      throw new NotFoundException('student not found');
    }
    const profile = await this.profileService.update(student.profile.id, dataProfile)
     const data = this.repo.merge(
       student,
      updateClassDto,
    );
    data.profile = profile;
    return await this.repo.save(data);
  }

  async changeClassStudent(id: number, classId: number): Promise<Student> {
    const student: Student = await this.repo.findOne({
      where: {
        id: id,
      },
    }); 
    const classOfStudent = await this.repoClass.findOne({ where: { id: +classId } });
    if (!classOfStudent) {
      throw new NotFoundException('class not found');
    }
    
    if (!student) {
      throw new NotFoundException('student not found');
    }
     const data = this.repo.merge(
       student,
      {classId:classOfStudent.id},
    );
    return await this.repo.save(data);
  }

  async remove(id: number) {
    const student = await this.repo.findOne({
      where: {
        id: id,
        status:1
      },
      // relations: ['profile'],
    })
    if (!student) {
      throw new NotFoundException('student not found');
    }
    const deleteStudent = await this.repo.remove(student);
    // await this.profileService.remove(student.profile.id ??0);
    return deleteStudent
  }

  async blockStudent(id: number): Promise<Student> {
    const student: Student = await this.repo.findOne({
      where: {
        id: id,
      },
    }); 

    
    if (!student) {
      throw new NotFoundException('student not found');
    }
     const data = this.repo.merge(
       student,
      {isChange:true},
    );
    return await this.repo.save(data);
  }

// chuyen lop
  async updateStudent(query: PromotedDto):Promise<Student> {
    const { stundentId, newClassId, oldSchoolYearId, newSchoolYearId,  oldClassId} = query;
    const oldClass: Class = await this.repoClass.findOne({
      where: {
        id: oldClassId,
         schoolYear: { id: oldSchoolYearId }, 
      }
    })
    const newClass: Class = await this.repoClass.findOne({
      where: {
        id: newClassId,
         schoolYear: { id: newSchoolYearId }, 
      }
    })
    if (!newClass) {
      throw new NotFoundException('New class not found');
    }
    if (!oldClass) {
      throw new NotFoundException('Old class not found');
    }
    const student: Student = await this.repo.findOne({
      where: {
        classId:oldClass.id,
        id: stundentId,
      },
      relations: ['profile'],
    })

    if (!student) {
      throw new NotFoundException('Student not found')
    }

     if (student?.isChange) {
      throw new BadRequestException('Students have already move up in class')
    }
    this.blockStudent(+student.id)
    const cls = await this.repo.save({ classId: newClass.id || null, profile: student.profile });
    return cls
  
    
  }
}