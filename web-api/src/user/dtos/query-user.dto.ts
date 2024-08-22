import { IsEmail, IsNumber, IsOptional, IsString } from "class-validator";

export class QueryUserDto {
    @IsEmail()
    @IsOptional()
    email: string;

    @IsEmail()
    @IsOptional()
    username: string;

    @IsString()
    @IsOptional()
    firstname: string;

    @IsString()
    @IsOptional()
    lastname: string;

    @IsNumber()
    @IsOptional()
    role_id: number;

    @IsNumber()
    @IsOptional()
    room_id: number;
}