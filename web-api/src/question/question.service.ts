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

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question) private repo: Repository<Question>,
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
      queryBuilder.andWhere('question.name LIKE :name', { name: `%${pageOptions.search}%` });
    }

    queryBuilder.orderBy("question.createdAt", pageOptions.order)
      .skip(pageOptions.skip)
      .take(pageOptions.take);

    const itemCount = await queryBuilder.getCount();
    const pageMetaDto = new PageMetaDto({ pageOptionsDto: pageOptions, itemCount });
    const entities = await queryBuilder.getMany();

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
      answerUpdated.push(await this.answerService.update(+question.answers[i].id,answers[i]));
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
}