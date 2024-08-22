import {IsNumber, IsEmail, IsString, IsDateString, IsOptional, MinLength } from 'class-validator'

export class UpdateProfileDto {
     @IsNumber()
    id: number;
     @IsString()
    email: string;
    @IsString()
    fullname: string;
    @IsString()
    phone: string;
    @IsEmail()
    street: string;
    @IsString()
    birthday: Date;
    @IsNumber()
    ward_id: number;
     @IsNumber()
    district_id: number;
    @IsNumber()
    province_id: number;
     @IsNumber()
    account_id: number;
}
