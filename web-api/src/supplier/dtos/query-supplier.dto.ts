import { IsEmail, IsOptional, IsString } from "class-validator";

export class QuerySupplierDto {
    @IsString()
    @IsOptional()
    name: string;
}