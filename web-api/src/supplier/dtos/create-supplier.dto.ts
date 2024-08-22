import { IsEmail, IsString, IsDateString, IsOptional } from 'class-validator'

export class CreateSupplierDto {
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
