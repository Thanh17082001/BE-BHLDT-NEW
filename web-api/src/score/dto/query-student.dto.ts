import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsSemVer, IsString } from "class-validator";

export class QueryScore {
    @ApiProperty()
    @IsString()
    classId: number
    
     @ApiProperty()
    @IsString()
    schoolYearId: number
    
     @ApiProperty()
    @IsString()
    subjectId: number
    
     @ApiProperty()
    @IsString()
    typeScoreId: number
    
    studentId?:number
}