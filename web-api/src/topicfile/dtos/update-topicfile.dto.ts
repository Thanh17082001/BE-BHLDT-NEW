import { IsNumber, IsEmail, IsString, IsDateString, IsOptional, MinLength, IsNotEmpty } from 'class-validator'

export class UpdateTopicFileDto {
    @IsNumber()
    id: number;
    @IsNotEmpty()
    @IsString()
    name: string;
    @IsNotEmpty()
    @IsNumber()
    topic_id: number;
}
