import { forwardRef, Module } from '@nestjs/common';
import { SubjectService } from './subject.service';
import { SubjectController } from './subject.controller';
import { Subject } from './entities/subject.entity';

import { TypeOrmModule } from '@nestjs/typeorm';
import { GradeModule } from 'src/grade/grade.module';
import { FileModule } from 'src/file/file.module';
import { LessonPlanModule } from 'src/lesson-plan/lesson-plan.module';
@Module({
  imports: [TypeOrmModule.forFeature([Subject]), GradeModule, forwardRef(() => FileModule), forwardRef(() => LessonPlanModule)],
  controllers: [SubjectController],
  providers: [SubjectService],
  exports: [SubjectService,TypeOrmModule],
})
export class SubjectModule { }
