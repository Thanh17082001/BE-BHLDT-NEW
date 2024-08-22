import { IsEmail, IsString, IsDateString, IsOptional, IsNotEmpty, IsNumber } from 'class-validator'

export class CreateTopicFileDto {
    @IsString()
    @IsNotEmpty()
    name: string;
    @IsNumber()
    topic_id: number;
}
