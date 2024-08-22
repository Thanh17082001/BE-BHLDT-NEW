import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsEmail, IsString, IsDateString, IsOptional, IsNotEmpty } from 'class-validator'

export class CreateSubjectDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;
    @ApiProperty()
    @IsNumber()
    grade_id: number;
}
