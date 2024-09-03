import { Module } from '@nestjs/common';
import { ExamService } from './exam.service';
import { ExamController } from './exam.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Exam } from './entities/exam.entity';
import { QuestionModule } from 'src/question/question.module';
import { LevelModule } from 'src/level/level.module';
import { TopicModule } from 'src/topic/topic.module';

@Module({
  imports: [TypeOrmModule.forFeature([Exam]), QuestionModule, TopicModule, LevelModule],
  controllers: [ExamController],
  providers: [ExamService],
})
export class ExamModule {}
