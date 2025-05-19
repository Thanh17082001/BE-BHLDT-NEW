import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsEmail, IsString, IsDateString, IsOptional, IsArray, IsBoolean } from 'class-validator'

export class CreateFileDto {
    @ApiProperty()
    @IsString()
    name: string;
    
    path?: string = '';
    
   
    @IsString()
    @IsOptional()
    previewImage?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    filetype_id?: number;

    @ApiProperty()
    @IsString()
    @IsOptional()
    topic_id?: number;

    @ApiProperty({required:false})
    @IsString()
    @IsOptional()
    parent_id?: number;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    isGdGroup?: boolean = true;

    @ApiProperty({required:false})
    @IsString()
    @IsOptional()
    subject_id?: number;


    @ApiProperty({ type: 'file', format: 'file', required: false })
    file?: Express.Multer.File
    @IsBoolean()
    isFolder: boolean = true;


    
}
