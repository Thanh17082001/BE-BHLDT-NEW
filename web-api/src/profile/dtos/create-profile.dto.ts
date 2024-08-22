import {IsNumber, IsEmail, IsString, IsDateString, IsOptional } from 'class-validator'

export class CreateProfileDto {
    @IsString()
    fullname: string;
     @IsString()
    email: string;
     @IsString()
    code: string;
    @IsString()
    gender: string;
    @IsString()
    phone: string;
    @IsString()
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
    account_id?: number;
}
