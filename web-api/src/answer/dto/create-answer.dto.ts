import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsNumber } from "class-validator";


export class CreateAnswerDto {
    @ApiProperty()
    @IsNotEmpty()
    content: string;

    @ApiProperty()
    @IsNumber()
    questionId: number;

    @ApiProperty()
    @IsBoolean()
    isCorrect: boolean;
}
