import { Module } from '@nestjs/common';
import { ExamService } from './exam.service';
import { ExamController } from './exam.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Exam } from './entities/exam.entity';
import { QuestionModule } from 'src/question/question.module';
import { LevelModule } from 'src/level/level.module';
import { TopicModule } from 'src/topic/topic.module';
import { SubjectModule } from 'src/subject/subject.module';
import { PartModule } from 'src/part/part.module';

@Module({
  imports: [TypeOrmModule.forFeature([Exam]), QuestionModule, TopicModule, LevelModule, SubjectModule, PartModule],
  controllers: [ExamController],
  providers: [ExamService],
})
export class ExamModule {}
