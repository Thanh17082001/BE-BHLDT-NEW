import {IsNumber, IsEmail, IsString, IsDateString, IsOptional, MinLength } from 'class-validator'

export class UpdateSupplierDto {
    @IsNumber()
    id: number;
    @IsString()
    name: string;
    @IsString()
    @IsOptional()
    description: string;
    @IsString()
    phone: string;
    @IsEmail()
    email: string;
    @IsString()
    @IsOptional()
    role: string;
    @IsString()
    @IsOptional()
    company_name: string;
    @IsString()
    @IsOptional()
    company_address: string;
    @IsString()
    @IsOptional()
    tax_number: string;
}
