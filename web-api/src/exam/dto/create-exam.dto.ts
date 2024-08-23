import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNumber, IsString } from "class-validator";

export class CreateExamDto {
    @ApiProperty()
    @IsString()
    name: string;
    @ApiProperty()
    @IsNumber()
    subjectId: number;
    @ApiProperty()
    @IsNumber()
    time: number;
    @ApiProperty()
    @IsNumber()
    subExam: number;
    @ApiProperty()
    @IsNumber()
    totalMultipleChoiceScore: number;
    @ApiProperty()
    @IsNumber()
    totalEssayScore: number;
    @ApiProperty({example: [1,2,3]})
    @IsArray()
    questionIds: number[];
}
