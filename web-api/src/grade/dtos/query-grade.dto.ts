import { IsEmail, IsOptional, IsString } from "class-validator";

export class QueryGradeDto {
    @IsString()
    @IsOptional()
    name: string;
}