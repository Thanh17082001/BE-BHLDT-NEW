import { Module } from '@nestjs/common';
import { SchoolYearService } from './school-year.service';
import { SchoolYearController } from './school-year.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SchoolYear } from './entities/school-year.entity';

@Module({
  imports:[TypeOrmModule.forFeature([SchoolYear])],
  controllers: [SchoolYearController],
  providers: [SchoolYearService],
  exports:[TypeOrmModule]
})
export class SchoolYearModule {}
