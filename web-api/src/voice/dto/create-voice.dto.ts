import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNumber, IsString } from "class-validator";

export class CreateVoiceDto {
    @ApiProperty()
    @IsString()
    fileId: number;

    @ApiProperty()
    @IsString()
    typeVoiceId: number;
    
    @ApiProperty({ type: 'file', format: 'file', required: false })
    file?: Express.Multer.File
    
    link?: string

     name?: string
    
    @ApiProperty()
    @IsString()
    order: number
   
    @ApiProperty()
    @IsString()
    isGeneral: boolean
}
