import { PartialType } from '@nestjs/swagger';
import { IsNumber, IsEmail, IsString, IsDateString, IsOptional, MinLength, IsNotEmpty } from 'class-validator'
import { CreateSubjectDto } from './create-subject.dto';

export class UpdateSubjectDto extends PartialType(CreateSubjectDto) {
   
}
