import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class CreateScoreDto {
     
    @ApiProperty({type:String})
     @IsString()
    name: string;
    
    @ApiProperty({type:Number})
     @IsNumber()
    score: number;
    
    @ApiProperty({type:Number})
     @IsNumber()
    coefficient: number;

    @ApiProperty({type:Number})
     @IsNumber()
    studentId: number;

     @ApiProperty({type:Number})
     @IsNumber()
    schoolYearId: number;

     @ApiProperty({type:Number})
     @IsNumber()
    subjectId: number;

    @ApiProperty({type:Number})
     @IsNumber()
    classId: number;

     @ApiProperty({type:Number})
     @IsNumber()
    typeScoreId: number;
}
