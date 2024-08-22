import { IsEmail, IsString, IsDateString, IsOptional, MinLength } from 'class-validator'

export class UpdateUserDto {

    @IsString()
    @IsOptional()
    firstname: string;

    @IsString()
    @IsOptional()
    lastname: string;

    @IsString()
    @IsOptional()
    username: string;

    @IsString()
    @IsOptional()
    gender: string;

    @IsDateString()
    @IsOptional()
    birthday: Date;
}
