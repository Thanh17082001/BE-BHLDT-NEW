import { Module } from '@nestjs/common';
import { QuestionService } from './question.service';
import { QuestionController } from './question.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './entities/question.entity';
import { AnswerModule } from 'src/answer/answer.module';
import { AnswerService } from 'src/answer/answer.service';

@Module({
  imports:[TypeOrmModule.forFeature([Question]), AnswerModule],
  controllers: [QuestionController],
  providers: [QuestionService, AnswerService],
  exports:[TypeOrmModule]
})
export class QuestionModule {}
