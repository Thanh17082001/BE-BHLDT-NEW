import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class CreateElearningThemeDto {

    @ApiProperty()
    @IsString()
    title: string;

    @ApiProperty()
    @IsString()
    content: string;

    @ApiProperty({ required: false })
    @IsOptional()
    path?: string = '';

    @ApiProperty({ type: 'file', format: 'file', required: false })
    file?: Express.Multer.File

}
