import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class ImportFileExcel {
    @ApiProperty({ type: 'file', format: 'file', required: true })
    file: Express.Multer.File
    @ApiProperty()
    @IsString()
    classId: number;
}