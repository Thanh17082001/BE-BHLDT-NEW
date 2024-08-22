import { Module } from '@nestjs/common';
import { LessonPlanService } from './lesson-plan.service';
import { LessonPlanController } from './lesson-plan.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LessonPlan } from './entities/lesson-plan.entity';
import { BookModule } from 'src/book/book.module';
import { CovertFileModule } from 'src/covert-file/covert-file.module';
import { CovertFileService } from 'src/covert-file/covert-file.service';
import { SubjectModule } from 'src/subject/subject.module';

@Module({
  imports:[TypeOrmModule.forFeature([LessonPlan]), SubjectModule],
  controllers: [LessonPlanController],
  providers: [LessonPlanService, CovertFileService],
})
export class LessonPlanModule {}
