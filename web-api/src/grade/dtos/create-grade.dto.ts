import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsDateString, IsOptional, IsNotEmpty, IsNumber } from 'class-validator'

export class CreateGradeDto {
    @ApiProperty({example:'String'})
    @IsString()
    @IsNotEmpty()
    name: string;
    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    schoolId: number;


    
}
