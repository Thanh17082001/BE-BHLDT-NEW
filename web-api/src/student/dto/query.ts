import { PartialType } from '@nestjs/swagger';
import { Student } from '../entities/student.entity';

export class QueryDto {
  classId: number;
  schoolYearId: number;
  subjectId: number;
  typeScoreId: number;}