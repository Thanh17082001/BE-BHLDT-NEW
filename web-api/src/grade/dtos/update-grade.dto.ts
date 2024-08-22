import { PartialType } from '@nestjs/swagger';
import { IsNumber, IsEmail, IsString, IsDateString, IsOptional, MinLength, IsNotEmpty } from 'class-validator'
import { CreateGradeDto } from './create-grade.dto';

export class UpdateGradeDto extends PartialType (CreateGradeDto) {
}
