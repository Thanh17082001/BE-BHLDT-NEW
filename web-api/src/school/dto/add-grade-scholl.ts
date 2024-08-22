import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNumber, IsString } from "class-validator";

export class AddGradesDto{
    @ApiProperty()
    @IsNumber()
    id: number;

    @ApiProperty({example:['idgrade']})
    @IsArray()
    grades: Number[]
}