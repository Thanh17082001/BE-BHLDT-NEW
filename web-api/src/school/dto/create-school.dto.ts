import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateSchoolDto {
    @ApiProperty({type:String})
    @IsString()
    code: string;
    
    @ApiProperty({type:String})
     @IsString()
    name: string;

     @ApiProperty({type:String})
     @IsString()
    manageBy: string;
    
    @ApiProperty({type:String})
     @IsString()
    address: string;
    
    @ApiProperty({type:String})
     @IsString()
    description: string;
}
