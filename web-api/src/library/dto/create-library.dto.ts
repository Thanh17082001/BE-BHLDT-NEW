import { ApiProperty } from "@nestjs/swagger";
import { File } from "buffer";
import { IsNumber, IsString } from "class-validator";

export class CreateLibraryDto {
    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsString()
    size: number;

    path: string;

    linkImage: String;


    @ApiProperty({
        type: 'array',
        items: {
            type: 'file',
            format: 'binary',
        },
        required: false,
    })
    files: Array<{ ptt: Express.Multer.File, image: Express.Multer.File }>

    @ApiProperty()
    @IsString()
    subjectId: number;

    @ApiProperty()
    @IsString()
    gradeId: number;

    @ApiProperty()
    @IsString()
    bookId: number;

    @ApiProperty()
    @IsString()
    topicId: number;

    @ApiProperty()
    @IsString()
    typeId: number;
}
