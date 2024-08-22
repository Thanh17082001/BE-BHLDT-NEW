import { PartialType } from '@nestjs/swagger';
import { IsNumber, IsEmail, IsString, IsDateString, IsOptional, MinLength, IsNotEmpty } from 'class-validator'
import { CreateTopicDto } from './create-topic.dto';

export class UpdateTopicDto extends PartialType(CreateTopicDto) {
   
}
