import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class ImportFileExcel {
    @ApiProperty({ type: 'file', format: 'file', required: true })
    file: Express.Multer.File
    
    @ApiProperty()
    @IsString()
    subjectId: number;

    // @ApiProperty()
    // @IsString()
    // partId: number;

    @ApiProperty()
    @IsString()
    topicId: number;

    @ApiProperty()
    @IsString()
    typeQuestionId: number;
}