import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Answer } from './entities/answer.entity';
import { Repository } from 'typeorm';
import { PageOptionsDto } from 'src/utils/dtos/pageoptions-dto';
import { difference } from 'src/utils/differeceArray';
import { ItemDto, PageDto } from 'src/utils/dtos/page-dto';
import { PageMetaDto } from 'src/utils/dtos/pagemeta-dto';
import { Question } from 'src/question/entities/question.entity';

@Injectable()
export class AnswerService {
  constructor(
    @InjectRepository(Answer) private repo: Repository<Answer>,
    @InjectRepository(Question) private repoQuestion: Repository<Question>,
  ) {
  }
  async create(createTypeQuestionDto: CreateAnswerDto): Promise<Answer> {
    const { content, questionId, isCorrect } = createTypeQuestionDto;
    const question:Question = await this.repoQuestion.findOne({ where: { id: +questionId } });
    if (!question) {
      throw new NotFoundException('Question is Already exits!');
    }
    const cls = await this.repo.save({ question, content, isCorrect })
    return cls
  }

  
  async findAll( pageOptions : PageOptionsDto, query: Partial<Answer>): Promise<PageDto<Answer>> {
    const queryBuilder = this.repo.createQueryBuilder('answer')
    if (!!query && Object.keys(query).length > 0) {
      const arrayQuery = difference(Object.keys(pageOptions), Object.keys(query))
     arrayQuery.forEach((key) => {
        if (key !== undefined && key !== null && key!='page' && key != 'take' && key != 'skip' && key != 'order' ) {
          queryBuilder.andWhere(`answer.${key} = :${key}`, { [key]: query[key] });
        }
      });
    }

     if (pageOptions.search) {
      queryBuilder.andWhere('answer.name LIKE :name', { name: `%${pageOptions.search}%` });
    }

    queryBuilder.orderBy("answer.createdAt", pageOptions.order)
    .skip(pageOptions.skip)
      .take(pageOptions.take);
      
      const itemCount = await queryBuilder.getCount();
      const pageMetaDto = new PageMetaDto({pageOptionsDto:pageOptions, itemCount });
    const entities = await queryBuilder.getMany();

    return new PageDto(entities, pageMetaDto);
    
  }
  

  async findOne(id: number): Promise<ItemDto<Answer>> {
    return new ItemDto (await this.repo.findOne({
      where: {
        id:id
      }
    }))
  }

  async update(id: number, updateTypeScore: Partial<UpdateAnswerDto>): Promise<Answer> {
    let answer: Answer = await this.repo.findOne({
      where: {
        id:id
      }
    });

      if (!answer) {
        // Tạo một bản ghi mới nếu không tìm thấy
        answer = this.repo.create({ ...updateTypeScore }); // Khởi tạo với dữ liệu mới
    }
   
     const data = this.repo.merge(
      answer,
      updateTypeScore,
    );
    return await this.repo.save(data);
  }

  async remove(id: number):Promise<Answer> {
    const typeQuestion: Answer = await this.repo.findOne({
      where: {
        id:id
      }
    });
    if (!typeQuestion) {
      throw new NotFoundException('Answer score does not exits!');
    }
    return await this.repo.remove(typeQuestion)
  }

}