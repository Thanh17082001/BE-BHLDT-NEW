import { forwardRef, Module } from '@nestjs/common';
import { TypeScoreService } from './score.service';
import { ScoreController } from './score.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Score } from './entities/score.entity';
import { StudentModule } from 'src/student/student.module';
import { SubjectModule } from 'src/subject/subject.module';
import { SchoolYearModule } from 'src/school-year/school-year.module';
import { ClassModule } from 'src/class/class.module';
import { TypeScoreModule } from 'src/type-score/type-score.module';
import { StudentService } from 'src/student/student.service';

@Module({
  imports: [TypeOrmModule.forFeature([Score]), forwardRef(() => StudentModule),SubjectModule, SchoolYearModule, ClassModule, TypeScoreModule],
  controllers: [ScoreController],
  providers: [TypeScoreService],
  exports:[TypeScoreService, TypeOrmModule]
})
export class ScoreModule {}
