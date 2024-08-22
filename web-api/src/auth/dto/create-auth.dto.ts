import { ApiProperty } from "@nestjs/swagger";

export class CreateAuthDto {
    name: string;
    email: string;
    password: string;
    refreshToken: string;
}