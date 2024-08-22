import { IsEmail, IsOptional, IsString } from "class-validator";

export class QueryFileTypeDto {
    @IsString()
    @IsOptional()
    name: string;
}