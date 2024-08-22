import { forwardRef, Module } from '@nestjs/common';
import { GradeService } from './grade.service';
import { GradeController } from './grade.controller';
import { Grade } from './entities/grade.entity';

import { TypeOrmModule } from '@nestjs/typeorm';
import { SchoolModule } from 'src/school/school.module';

@Module({
  imports: [TypeOrmModule.forFeature([Grade]), forwardRef(() => SchoolModule),],
  controllers: [GradeController],
  providers: [GradeService],
  exports: [GradeService, TypeOrmModule],
})
export class GradeModule {}
