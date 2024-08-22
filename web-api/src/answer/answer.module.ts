import { QuestionModule } from './../question/question.module';
import { forwardRef, Module } from '@nestjs/common';
import { AnswerService } from './answer.service';
import { AnswerController } from './answer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Answer } from './entities/answer.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Answer]), forwardRef(() => QuestionModule)],
  controllers: [AnswerController],
  providers: [AnswerService],
  exports:[TypeOrmModule]
})
export class AnswerModule {}
