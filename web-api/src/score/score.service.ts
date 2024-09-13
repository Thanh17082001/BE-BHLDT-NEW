import { Subject } from '../subject/entities/subject.entity';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateScoreDto } from './dto/create-score.dto';
import { UpdateScoreDto } from './dto/update-score.dto';
import { Score } from './entities/score.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from 'src/student/entities/student.entity';
import { StudentService } from 'src/student/student.service';
import { PageOptionsDto } from 'src/utils/dtos/pageoptions-dto';
import { ItemDto, PageDto } from 'src/utils/dtos/page-dto';
import { difference } from 'src/utils/differeceArray';
import { PageMetaDto } from 'src/utils/dtos/pagemeta-dto';
import { SchoolYear } from 'src/school-year/entities/school-year.entity';
import { Class } from 'src/class/entities/class.entity';
import { TypeScore } from 'src/type-score/entities/type-score.entity';
import { QueryScore } from './dto/query-student.dto';
import { StatisticalDto } from './dto/statistical-dto';
import { calculateStatistics } from 'src/utils/statictical';
import { promises } from 'dns';
import { scoreAverageStatistical } from 'src/utils/score-avg';


@Injectable()
export class TypeScoreService {
  constructor(
    @InjectRepository(Score) private repo: Repository<Score>,
    @InjectRepository(Student) private repoStudent: Repository<Student>,
    @InjectRepository(SchoolYear) private repoSchoolYear: Repository<SchoolYear>,
    @InjectRepository(Subject) private repoSubject: Repository<Subject>,
    @InjectRepository(Class) private repoClass: Repository<Class>,
    @InjectRepository(TypeScore) private repoTypeScore: Repository<TypeScore>,
    // private readonly  studentService: StudentService,
  ) {
  }
  async create(createClassDto: Partial<CreateScoreDto>): Promise<Score> {
    const { name, score, studentId, coefficient, schoolYearId, subjectId, classId, typeScoreId} = createClassDto;
    const student:Student = await this.repoStudent.findOne({where:{id:+studentId}});
    const subject:Subject = await this.repoSubject.findOne({where:{id:+subjectId}});
    const schoolYear:SchoolYear = await this.repoSchoolYear.findOne({where:{id:+schoolYearId}});
    const class1:Class = await this.repoClass.findOne({where:{id:+classId}});
    const typeScore:TypeScore = await this.repoTypeScore.findOne({where:{id:+typeScoreId}});
    
   
   
    if (!subject) {
      throw new NotFoundException('Subject not found');
    }

    if (!schoolYear) {
      throw new NotFoundException('SchoolYear not found');
    }
     if (!student) {
      throw new NotFoundException('student not found');
    }

     if (student?.isChange) {
      throw new BadRequestException('Students have already move up in class');
    }

     if (!class1) {
      throw new NotFoundException('class not found');
    }

     if (!typeScore) {
      throw new NotFoundException('Type score not found');
    }


    
    return await this.repo.save({
      name, score, studentId, coefficient, schoolYearId, subjectId, classId, typeScoreId
    });
  }

  async findAll(pageOptions: PageOptionsDto, query: Partial<Score>): Promise<PageDto<Score>> {
    const queryBuilder = this.repo.createQueryBuilder('score')
    if (!!query && Object.keys(query).length > 0) {
      const arrayQuery = difference(Object.keys(pageOptions), Object.keys(query))
      console.log(arrayQuery);
      arrayQuery.forEach((key) => {
        if (key !== undefined && key !== null && key!='page' && key != 'take' && key != 'skip' && key != 'order') {
          queryBuilder.andWhere(`score.${key} = :${key}`, { [key]: query[key] });
        }
      });
    }

    queryBuilder.orderBy("score.createdAt", pageOptions.order)
      .skip(pageOptions.skip)
      .take(pageOptions.take);

    const itemCount = await queryBuilder.getCount();
    const pageMetaDto = new PageMetaDto({ pageOptionsDto: pageOptions, itemCount });
    const entities = await queryBuilder.getMany();

    return new PageDto(entities, pageMetaDto);

  }

  async statistical(statisticalDto: StatisticalDto) {
    let data: any[] = []
    // hàm lấy ra danh sách điểm nhóm theo học sinh và loại điểm(HK1, HK2)
    const result = await this.selectStatistical(statisticalDto)

    //thống kê cả năm
    if (!statisticalDto.typeScoreId || +statisticalDto.typeScoreId === 0) {
      //tạo ra object từng học sinh với mảng điểm của học sinh đó
      const groupedByStudentId = result.reduce((acc, item) => {
        // Nếu chưa có nhóm cho studentId, tạo mới
        if (!acc[item.studentId]) {
          acc[item.studentId] = {
            studentId: item.studentId,
            scores: []
          };
        }

        // Thêm thông tin vào mảng scores
        acc[item.studentId].scores.push(item);
        return acc;
      }, {});

      // chỉ lấy giá trị của object trên và tính tổng trung bình cả năm
       data = Object.values(groupedByStudentId);
      for (let i = 0; i < data.length; i++){
        data[i].avgEntire = scoreAverageStatistical(data[i]?.scores)
      }
    }
    
    // thống kê từng học kỳ
    else {
      data = result.filter(item => item.typeScoreId === +statisticalDto.typeScoreId)
    }

    const statistical = calculateStatistics(data);
    return {
      data,
      statistical
    };

  }

  async selectStatistical(statisticalDto: StatisticalDto):Promise<any[]> {
    const queryBuilder = this.repo.createQueryBuilder('score')

    const result = await queryBuilder
      .select('score.studentId', 'studentId')  // Select the studentId
      .addSelect('score.typeScoreId', 'typeScoreId')
      .addSelect('SUM(score.score * score.coefficient)', 'totalScore')// Calculate the weighted average and round to 1 decimal place
      .addSelect('SUM( score.coefficient)', 'TotalCoefficient')// Calculate the weighted average and round to 1 decimal place
      .where('score.classId = :classId', { classId: +statisticalDto.classId })
      .andWhere('score.schoolYearId = :schoolYearId', { schoolYearId: +statisticalDto.schoolYearId })
      // .andWhere('score.typeScoreId = :typeScoreId', { typeScoreId: +statisticalDto.typeScoreId })
      .groupBy('score.studentId')  // Group by studentId
      .addGroupBy('score.typeScoreId') 
      // .orderBy('score.typeScoreId', 'ASC') 
      .getRawMany();
    

    for (let i = 0; i < result.length; i++) {
      const avg = result[i].totalScore / result[i].TotalCoefficient;
      result[i].avg = +avg.toFixed(2)

      const typeScores = await this.repoTypeScore.findOne({where:{id:+result[i].typeScoreId}});
      result[i].typeSCoreCoefficient = typeScores.coefficient
      result[i].typeSCoreName = typeScores.name
    }
    return result
  }





  async findOne(id: number): Promise<ItemDto<Score>> {
    return new ItemDto( await this.repo.findOne({
      where: {
        id: id,
      },
    }))
  }

  async update(id: number, updateScoreDto: Partial<UpdateScoreDto>): Promise<Score> {
    const score: Score = await this.repo.findOne({where:{id:+id}});
    const student: Student = await this.repoStudent.findOne({ where: { id: +updateScoreDto.studentId } });
     const subject:Subject = await this.repoSubject.findOne({where:{id:+updateScoreDto.subjectId}});
    const schoolYear:SchoolYear = await this.repoSchoolYear.findOne({where:{id:+updateScoreDto.schoolYearId}});
    const class1:Class = await this.repoClass.findOne({where:{id:+updateScoreDto.classId}});
    const typeScore:TypeScore = await this.repoTypeScore.findOne({where:{id:+updateScoreDto.typeScoreId}});
    
   
   
    if (!subject) {
      throw new NotFoundException('Subject not found');
    }

    if (!schoolYear) {
      throw new NotFoundException('SchoolYear not found');
    }
    if (!score) {
      throw new NotFoundException('Score not found');
    }
    if (!student) {
      throw new NotFoundException('student not found');
    }
    if (student?.isChange) {
      throw new BadRequestException('Students have already move up in class');
    }
     if (!class1) {
      throw new NotFoundException('class not found');
    }

     if (!typeScore) {
      throw new NotFoundException('Type score not found');
    }
   
    const data = this.repo.merge(
      score,
      updateScoreDto,
    );
    return await this.repo.save(data);
  }

   async remove(id: number):Promise<Score> {
      const score = await this.repo.findOne({
      where: { id: id },
      });
     
     const student: Student = await this.repoStudent.findOne({ where: { id: +score.studentId } });
     if (student?.isChange) {
      throw new BadRequestException('Students have already move up in class');
    }

    if (!score) {
      throw new NotFoundException(`Class with ID ${id} not found`);
    }

    // Delete the score, related classes will be deleted automatically due to cascade
    return await this.repo.remove(score);
  }
}