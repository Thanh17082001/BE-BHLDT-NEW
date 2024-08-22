import { ApiProperty } from "@nestjs/swagger";
import { IsBase64, IsNotEmpty, IsString } from "class-validator";

export class CreateBookDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    name: string;
    @ApiProperty({ type: 'file', format: 'file', required: true })
    file:  Express.Multer.File
    linkFile:string
}
