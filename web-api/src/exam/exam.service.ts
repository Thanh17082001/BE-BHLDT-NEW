import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Exam } from './entities/exam.entity';
import { Not, Repository } from 'typeorm';
import { PageOptionsDto } from 'src/utils/dtos/pageoptions-dto';
import { ItemDto, PageDto } from 'src/utils/dtos/page-dto';
import { difference } from 'src/utils/differeceArray';
import { Question } from 'src/question/entities/question.entity';
import { PageMetaDto } from 'src/utils/dtos/pagemeta-dto';

@Injectable()
export class ExamService {
  constructor(
    @InjectRepository(Exam) private repo: Repository<Exam>,
    @InjectRepository(Question) private questionRepository: Repository<Question>,
  ) {
  }
  async create(createExamDto: CreateExamDto): Promise<Exam> {

    const { name, subjectId, time, subExam, totalMultipleChoiceScore, totalEssayScore, questionIds } = createExamDto;
     const questions:Question[] = await this.questionRepository.findByIds(questionIds);
    const exits = await this.repo.findOne({
      where: {
        name:createExamDto.name,
      }
    })

    if (exits) {
      throw new BadRequestException('exam is already!')
    }

    return await this.repo.save({name, subjectId, time, subExam, totalMultipleChoiceScore, totalEssayScore,questions});
  }

  
  async findAll( pageOptions : PageOptionsDto, query: Partial<Exam>): Promise<PageDto<Exam>> {
    const queryBuilder = this.repo.createQueryBuilder('exam').where('exam.status = :status', { status: 1 }).leftJoinAndSelect('exam.questions', 'question'); 
    if (!!query && Object.keys(query).length > 0) {
      const arrayQuery = difference(Object.keys(pageOptions), Object.keys(query))
     arrayQuery.forEach((key) => {
        if (key !== undefined && key !== null && key!='page' && key != 'take' && key != 'skip' && key != 'order' ) {
          queryBuilder.andWhere(`exam.${key} = :${key}`, { [key]: query[key] });
        }
      });
    }

     if (pageOptions.search) {
      queryBuilder.andWhere('exam.name LIKE :name', { name: `%${pageOptions.search}%` });
    }

    queryBuilder.orderBy("exam.createdAt", pageOptions.order)
    .skip(pageOptions.skip)
      .take(pageOptions.take);
      
      const itemCount = await queryBuilder.getCount();
      const pageMetaDto = new PageMetaDto({pageOptionsDto:pageOptions, itemCount });
    const entities = await queryBuilder.getMany();

     const categorizedExams = entities.map(exam => {
       const typeQuestionMap = exam.questions.reduce((acc, question) => {
                const { typeQuestionId } = question;
         if (!acc[typeQuestionId]) {
                    acc[typeQuestionId] = [];
                }
                acc[typeQuestionId].push(question);
                return acc;
       }, {});

            // Tạo hai mảng cho các loại câu hỏi dựa trên typeQuestionId
            const MultipleChoiceScore = typeQuestionMap[1] || [];
            const EssayScore = typeQuestionMap[2] || [];

            return {
                ...exam,
                MultipleChoiceScore,
                EssayScore,
            };
        });

    return new PageDto(categorizedExams, pageMetaDto);
    
  }
  

  async findOne(id: number): Promise<ItemDto<Exam>> {
    const exam: Exam = await this.repo.findOne({
      where: {
        id:id
      },
      relations: ['questions']
    })

     const typeQuestionMap = exam.questions.reduce((acc, question) => {
            const { typeQuestionId } = question;
            if (!acc[typeQuestionId]) {
                acc[typeQuestionId] = [];
            }
            acc[typeQuestionId].push(question);
            return acc;
        }, {});

        // Tạo các mảng cho các loại câu hỏi dựa trên typeQuestionId
        const MultipleChoiceScore = typeQuestionMap[1] || [];
            const EssayScore = typeQuestionMap[2] || [];

        // Tạo đối tượng kết quả
        const result = {
            ...exam,
                MultipleChoiceScore,
                EssayScore,
        };
    return new ItemDto (result)
  }

  async update(id: number, updateExamDto: Partial<UpdateExamDto>): Promise<Exam> {
    const typeQuestion: Exam = await this.repo.findOne({
      where: {
        id:id
      }
    });
    const exits = await this.repo.findOne({
      where: {
        name:updateExamDto.name,
        id: Not(id),
        status:1
      }
    })
    if (exits) {
      throw new BadRequestException('exam is already!')
    }
    if (!typeQuestion) {
      throw new NotFoundException('exam does not exits!');
    }
     const data = this.repo.merge(
      typeQuestion,
      updateExamDto,
    );
    return await this.repo.save(data);
  }

  async remove(id: number):Promise<Exam> {
    const typeQuestion: Exam = await this.repo.findOne({
      where: {
        id:id
      }
    });
    if (!typeQuestion) {
      throw new NotFoundException('Exam does not exits!');
    }
    return await this.repo.remove(typeQuestion)
  }

}
