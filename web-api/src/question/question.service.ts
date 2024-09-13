import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from './entities/question.entity';
import { AnswerService } from 'src/answer/answer.service';
import { PageOptionsDto } from 'src/utils/dtos/pageoptions-dto';
import { difference } from 'src/utils/differeceArray';
import { ItemDto, PageDto } from 'src/utils/dtos/page-dto';
import { PageMetaDto } from 'src/utils/dtos/pagemeta-dto';
import { TypeQuestion } from 'src/type-question/entities/type-question.entity';
import { Topic } from 'src/topic/entities/topic.entity';
import { Level } from 'src/level/entities/level.entity';
import { CLIENT_RENEG_LIMIT } from 'tls';
import { RandomQuestionDto } from './dto/randoom-question.dto';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question) private repo: Repository<Question>,
    @InjectRepository(TypeQuestion) private repoTypeQuestion: Repository<TypeQuestion>,
    @InjectRepository(Topic) private repoTopic: Repository<Topic>,
    @InjectRepository(Level) private repoLevel: Repository<Level>,
      private readonly answerService:AnswerService,
  ) {
  }
  async create(createQuestionDto: Partial<CreateQuestionDto>): Promise<Question> {
    const { content, subjectId, topicId, typeQuestionId, numberOfAnswers, levelId, score, answers } = createQuestionDto;
    // const grade = await this.gradeRepository.findOne({ where: { id: +gradeId } });
   

    let cls = await this.repo.create({ content, subjectId, topicId, typeQuestionId, numberOfAnswers, levelId, score});
    cls = await this.repo.save(cls);
    const dataAnswer = []
    for (let i = 0; i < answers.length; i++){
      answers[i].questionId = cls.id;
      dataAnswer.push(await this.answerService.create(answers[i]));
    }
    cls.answers = dataAnswer;
    return cls
  }

  async findAll(pageOptions: PageOptionsDto, querySchol: Partial<Question>): Promise<PageDto<Question>> {
    const queryBuilder = this.repo.createQueryBuilder('question').leftJoinAndSelect('question.answers','answer');

    if (!!querySchol && Object.keys(querySchol).length > 0) {
      const arrayQuery = difference(Object.keys(pageOptions), Object.keys(querySchol))
      arrayQuery.forEach((key) => {
        if (key !== undefined && key !== null && key!='page' && key != 'take' && key != 'skip' && key != 'order') {
          console.log(key);
          queryBuilder.andWhere(`question.${key} = :${key}`, { [key]: querySchol[key] });
        }
      });
    }
    if (pageOptions.search) {
      queryBuilder.andWhere('question.content LIKE :content', { content: `%${pageOptions.search}%` });
    }

    queryBuilder.orderBy("question.createdAt", pageOptions.order)
      .skip(pageOptions.skip)
      .take(pageOptions.take);

    const itemCount = await queryBuilder.getCount();
    const pageMetaDto = new PageMetaDto({ pageOptionsDto: pageOptions, itemCount });
    const entities = await queryBuilder.getMany();
    for (let i = 0; i < entities.length; i++){
        const typeQuestion:TypeQuestion = await this.repoTypeQuestion.findOne({
            where: {
             id:entities[i].typeQuestionId
            }
        });
      
       const level:Level = await this.repoLevel.findOne({
            where: {
             id:entities[i].levelId
            }
        });
        const topic:Topic = await this.repoTopic.findOne({
            where: {
             id:entities[i].topicId
            }
        });
        (entities[i] as any).typeQuestion = typeQuestion;
        (entities[i] as any).topic = topic;
        (entities[i] as any).level = level;
      }
    return new PageDto(entities, pageMetaDto);

  }


  async findOne(id: number): Promise<ItemDto<Question>>{
    return  new ItemDto( await this.repo.findOne({
      where: {
        id: id,
      },
      relations: ['answers'],
    }));
  }

  async update(id: number, updateQuetion: Partial<UpdateQuestionDto>): Promise<Question> {
    const question: Question = await this.repo.findOne({
      where: {
        id: id,
      },
      relations: ['answers'],
    });
    const answers = updateQuetion.answers;
    const answerUpdated =[]
    for (let i = 0; i < answers.length; i++){
      answerUpdated.push(await this.answerService.update(+question.answers[i]?.id || -1,answers[i]));
    }
    if (!question) {
      throw new NotFoundException('question not found');
    }
    const data = this.repo.merge(
      question,
      updateQuetion,
    );
    data.answers = answerUpdated;
    return await this.repo.save(data);
  }

   async remove(id: number):Promise<Question> {
      const question = await this.repo.findOne({
      where: { id: id },
    });

    if (!question) {
      throw new NotFoundException(`Class with ID ${id} not found`);
    }

    // Delete the question, related classes will be deleted automatically due to cascade
    return await this.repo.remove(question)
  }

  async getRandomItems(randomqestTionDto: RandomQuestionDto): Promise<Question[]> {

    const levels = randomqestTionDto.levels
    const result = []
    for (let i = 0; i < levels.length; i++){
      const level=levels[i]
      const count = level.count
      const data = await this.repo
        .createQueryBuilder('question')
        .orderBy('RANDOM()') // Sử dụng RANDOM() nếu bạn dùng PostgreSQL hoặc SQLite
        .limit(count)
        .where('question.subjectId = :subjectId', { subjectId: randomqestTionDto.subjectId })
        .andWhere('question.topicId = :topicId', { topicId: randomqestTionDto.topicId })
        .andWhere('question.typeQuestionId = :typeQuestionId', { typeQuestionId: randomqestTionDto.typeQuestionId })
        .andWhere('question.levelId = :levelId', { levelId: level.levelId })
        .getMany();
      result.push(...data)
      }
      return result
    }
}