import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class CreateClassDto {
    @ApiProperty()
    @IsString()
    name: string;
    
     @ApiProperty()
    @IsString()
    suffixes: string;

    @ApiProperty()
    @IsNumber()
    gradeId: number
    
    @ApiProperty()
    @IsNumber()
    schoolYearId:number
}
