import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class CreateElearningVideoDto {

    @ApiProperty()
    @IsString()
    name: string;

    path?: string = '';
    @ApiProperty()
    @IsString()
    elearning_id: number;
    @ApiProperty()

    @IsString()
    page: number;

    @ApiProperty({ type: 'file', format: 'file', required: false })
    file?: Express.Multer.File

    linkFile: string;
}
