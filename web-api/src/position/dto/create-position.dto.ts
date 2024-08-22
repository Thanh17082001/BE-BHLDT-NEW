import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class CreatePositionDto {
    @ApiProperty()
    @IsString()
    name: string;
    
    @ApiProperty()
    @IsNumber()
    schoolId: number;
}
