import { IsEmail, IsOptional, IsString } from "class-validator";

export class QueryRoleDto {
    @IsString()
    @IsOptional()
    name: string;
}