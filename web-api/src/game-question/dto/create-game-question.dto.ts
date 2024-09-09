import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateGameQuestionDto {
    @ApiProperty()
    @IsString()
    suggest: string;
    @ApiProperty()
    @IsString()
    answer: string;
}
