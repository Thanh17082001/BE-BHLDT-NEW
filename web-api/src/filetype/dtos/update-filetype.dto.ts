import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsEmail, IsString, IsDateString, IsOptional, MinLength, IsNotEmpty } from 'class-validator'

export class UpdateFileTypeDto {
    @ApiProperty()
    @IsNumber()
    id: number;
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    name: string;
}
