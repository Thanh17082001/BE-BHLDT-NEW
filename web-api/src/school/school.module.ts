import { forwardRef, Module } from '@nestjs/common';
import { SchoolService } from './school.service';
import { SchoolController } from './school.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { School } from './entities/school.entity';
import { GradeModule } from 'src/grade/grade.module';
import { GradeService } from 'src/grade/grade.service';

@Module({
  imports:[TypeOrmModule.forFeature([School]), forwardRef(() => GradeModule),],
  controllers: [SchoolController],
  providers: [SchoolService],
  exports: [SchoolService, TypeOrmModule],
})
export class SchoolModule {}
