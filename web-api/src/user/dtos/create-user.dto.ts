import {IsEmail, IsString, IsDateString, IsOptional, Min, IsEmpty, MinLength, IsNotEmpty} from 'class-validator'
export class CreateUserDto {
    @MinLength(3)
    firstname: string;
    
    @MinLength(3)
    lastname: string;

    @IsEmail()
    email: string;

    @IsOptional()
    username: string;

    @IsOptional()
    phone: string;

    @IsNotEmpty({})
    password: string;

    @IsOptional()
    avatar: string;

    @IsOptional()
    gender: string;

    @IsDateString()
    birthday: string;

    @IsOptional()
    job_title: string

    @IsOptional()
    note: string

}
