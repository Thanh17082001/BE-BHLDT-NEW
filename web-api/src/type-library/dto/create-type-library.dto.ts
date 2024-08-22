import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";


export class CreateTypeLibraryDto { 
    @ApiProperty({type:String})
    @IsString()
    name: string;
}
