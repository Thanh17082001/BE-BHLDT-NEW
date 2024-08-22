import { IsEmail, IsOptional, IsString } from "class-validator";

export class QueryTopicDto {
    @IsString()
    @IsOptional()
    name: string;
}