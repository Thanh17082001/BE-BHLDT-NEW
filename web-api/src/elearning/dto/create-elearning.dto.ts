import { ApiProperty, OmitType } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateElearningDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    content: string;
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    title: string;
    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    subjectId: number;
    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    topic: number;
}
