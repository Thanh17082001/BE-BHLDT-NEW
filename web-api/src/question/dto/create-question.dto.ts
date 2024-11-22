import { Answer } from './../../answer/entities/answer.entity';
import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNumber, IsString } from "class-validator";
import { CreateAnswerDto } from 'src/answer/dto/create-answer.dto';

export class CreateQuestionDto {

    @ApiProperty()
    @IsString()
    content: string;
    @ApiProperty()
    @IsNumber()
    subjectId: number;

    @ApiProperty()
    @IsNumber()
    partId: number;
     @ApiProperty()
     @IsNumber()
    topicId: number;
     @ApiProperty()
     @IsNumber()
    typeQuestionId: number;
     @ApiProperty()
     @IsNumber()
    numberOfAnswers: number;
     @ApiProperty()
     @IsNumber()
    levelId: number;
    @ApiProperty()
    @IsNumber()
    score: number;

    @ApiProperty({ type: [CreateAnswerDto] })
    @IsArray()
    answers:CreateAnswerDto[];
}
