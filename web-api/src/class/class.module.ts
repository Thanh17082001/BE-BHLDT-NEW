import { Module } from '@nestjs/common';
import { ClassService } from './class.service';
import { ClassController } from './class.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Class } from './entities/class.entity';
import { GradeModule } from 'src/grade/grade.module';
import { SchoolYearModule } from 'src/school-year/school-year.module';

@Module({
  imports:[TypeOrmModule.forFeature([Class]), GradeModule, SchoolYearModule],
  controllers: [ClassController],
  providers: [ClassService],
  exports:[TypeOrmModule]
})
export class ClassModule {}
