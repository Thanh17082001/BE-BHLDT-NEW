import { Module } from '@nestjs/common';
import { SubjectService } from './subject.service';
import { SubjectController } from './subject.controller';
import { Subject } from './entities/subject.entity';

import { TypeOrmModule } from '@nestjs/typeorm';
import { GradeModule } from 'src/grade/grade.module';
@Module({
  imports: [TypeOrmModule.forFeature([Subject]), GradeModule],
  controllers: [SubjectController],
  providers: [SubjectService],
  exports: [SubjectService,TypeOrmModule],
})
export class SubjectModule { }
