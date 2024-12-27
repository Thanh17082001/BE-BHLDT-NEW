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
import { Topic } from 'src/topic/entities/topic.entity';
import { Level } from 'src/level/entities/level.entity';
import { CLIENT_RENEG_LIMIT } from 'tls';
import { QuestionService } from 'src/question/question.service';
import { Subject } from 'src/subject/entities/subject.entity';
import { Part } from 'src/part/entities/part.entity';

@Injectable()
export class ExamService {
  constructor(
    @InjectRepository(Exam) private repo: Repository<Exam>,
    @InjectRepository(Question) private questionRepository: Repository<Question>,
    @InjectRepository(Topic) private topicReponsitory: Repository<Topic>,
    @InjectRepository(Level) private levelRepository: Repository<Level>,
    @InjectRepository(Subject) private subjectRepository: Repository<Subject>,
    @InjectRepository(Part) private partRepository: Repository<Part>,
  ) {
  }
  async create(createExamDto: CreateExamDto): Promise<Exam> {

    const { name, subjectId, time, subExam, totalMultipleChoiceScore, totalEssayScore, questionIds, totalMultipleChoiceScorePartI, totalMultipleChoiceScorePartII, totalMultipleChoiceScorePartIII } = createExamDto;
    const questions: Question[] = await this.questionRepository.findByIds(questionIds);
    const exits = await this.repo.findOne({
      where: {
        name: createExamDto.name,
      }
    })

    if (exits) {
      throw new BadRequestException('exam is already!')
    }

    return await this.repo.save({ name, subjectId, time, subExam, totalMultipleChoiceScore, totalEssayScore, questions, totalMultipleChoiceScorePartI, totalMultipleChoiceScorePartII, totalMultipleChoiceScorePartIII });
  }


  async findAll(pageOptions: PageOptionsDto, query: Partial<Exam>): Promise<PageDto<Exam>> {
    const queryBuilder = this.repo.createQueryBuilder('exam').where('exam.status = :status', { status: 1 }).leftJoinAndSelect('exam.questions', 'question');
    if (!!query && Object.keys(query).length > 0) {
      const arrayQuery = difference(Object.keys(pageOptions), Object.keys(query))
      arrayQuery.forEach((key) => {
        if (key !== undefined && key !== null && key != 'page' && key != 'take' && key != 'skip' && key != 'order') {
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
    const pageMetaDto = new PageMetaDto({ pageOptionsDto: pageOptions, itemCount });
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


    for (let i = 0; i < categorizedExams?.length; i++) {
      for (let j = 0; j < categorizedExams[i].MultipleChoiceScore?.length; j++) {
        const questions = categorizedExams[i].MultipleChoiceScore
        const level: Level = await this.levelRepository.findOne({ where: { id: questions[j].levelId } });
        const topic: Topic = await this.topicReponsitory.findOne({ where: { id: questions[j].topicId } });
        const part: Part = await this.partRepository.findOne({ where: { id: questions[j].partId } });

        (categorizedExams[i].MultipleChoiceScore[j] as any).level = level;
        (categorizedExams[i].MultipleChoiceScore[j] as any).topic = topic;
        (categorizedExams[i].MultipleChoiceScore[j] as any).part = part;

      }
    }
    return new PageDto(categorizedExams, pageMetaDto);

  }


  async findOne(id: number) {
    const exam: Exam = await this.repo.findOne({
      where: {
        id: id
      },
      relations: ['questions', 'questions.answers']
    });
      (exam as any).subject = await this.subjectRepository.findOne({ where: { id: exam.subjectId } })
    if (!exam) {
      throw new NotFoundException('exam does not exits!')
    }


    const typeQuestionMap = exam?.questions.reduce((acc, question) => {
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


    return new ItemDto( await this.generateSubExams(result))
  }

  async update(id: number, updateExamDto: Partial<UpdateExamDto>): Promise<Exam> {

    const exam: Exam = await this.repo.findOne({
      where: {
        id: id
      }
    });

    const questionIds = updateExamDto.questionIds
    let questions = []
    for (let i = 0; i < questionIds.length; i++) {
      const question: Question = await this.questionRepository.findOne({ where: { id: questionIds[i] } })
      questions.push(question)
    }
    const exits = await this.repo.findOne({
      where: {
        name: updateExamDto.name,
        id: Not(id),
        status: 1
      }
    })
    if (exits) {
      throw new BadRequestException('exam is already!')
    }
    if (!exam) {
      throw new NotFoundException('exam does not exits!');
    }
    exam.questions = questions
    const data = this.repo.merge(
      exam,
      updateExamDto,
    );
    return await this.repo.save(data);
  }

  async remove(id: number): Promise<Exam> {
    const exam: Exam = await this.repo.findOne({
      where: {
        id: id
      }
    });
    if (!exam) {
      throw new NotFoundException('Exam does not exits!');
    }
    return await this.repo.remove(exam)
  }

  async generateSubExams(data) {
    const parts = await this.partRepository.find()
    const { subExam, MultipleChoiceScore } = data;
    // Tạo ra các đề con với thứ tự `MultipleChoiceScore` khác nhau
    const subExams = Array.from({ length: subExam + 1 }, (_, index) => {
      return {
        ...data,
        subExamIndex: index,
        MultipleChoiceScore: index === 0
          ? this.groupByPartId(MultipleChoiceScore, parts) // Giữ nguyên mảng gốc ở subExamIndex = 0
          : this.shuffleByPartIdToObjects([...MultipleChoiceScore], parts), 
      };
    });

    return subExams;
  }

  groupByPartId(array: any[], parts) {
    const result = array.reduce((acc, question) => {
      const { partId } = question;
      acc[partId] = acc[partId] || [];
      acc[partId].push(question); // Thêm câu hỏi vào phần tương ứng, giữ nguyên thứ tự
      return acc;
    }, {});

    const partObjects = Object.entries(result).map(([partId, questions]) => ({
      part: parts.find(part => part.id == +partId),
      questions: questions,
    }));
    return partObjects
  }
  
  // Hàm để trộn ngẫu nhiên một mảng
  shuffleArray(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  shuffleByPartIdToObjects(array: any[], parts) {
    // Nhóm câu hỏi theo `partId`
    const groupedByPart: Record<number, any[]> = array.reduce((acc, question) => {
      const { partId } = question;
      acc[partId] = acc[partId] || [];
      acc[partId].push(question);
      return acc;
    }, {});

    // Trộn từng nhóm và chuyển thành object
    const partObjects = Object.entries(groupedByPart).map(([partId, questions]) => ({
      part: parts.find(part => part.id == +partId),
      questions: this.shuffleArray(questions),
    }));

    return partObjects;
  }

}
