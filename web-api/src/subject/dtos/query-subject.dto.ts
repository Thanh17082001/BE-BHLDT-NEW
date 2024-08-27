import { IsEmail, IsOptional, IsString } from "class-validator";

export class QuerySubjectDto {
    @IsString()
    @IsOptional()
    name: string;
    @IsString()
    @IsOptional()
    topic:number
    
}