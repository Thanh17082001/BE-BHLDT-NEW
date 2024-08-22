import { IsEmail, IsOptional, IsString } from "class-validator";

export class QueryTopicFileDto {
    @IsString()
    @IsOptional()
    name: string;
}