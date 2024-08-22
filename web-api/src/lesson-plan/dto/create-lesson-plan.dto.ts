
import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";
import { Book } from "src/book/entities/book.entity";

export class CreateLessonPlanDto {
    
    
    @ApiProperty({type:String})
     @IsString()
    name: string;

    // @ApiProperty({ type: Number })
    // @IsNumber()
    // size: number;
    
    @ApiProperty({ type: Number })
    @IsString()
    topic: number;

    linkImage: string;
    
    // @ApiProperty({type:String})
    path: string;
    previewImage: string;

    @ApiProperty({ type: Number })
    @IsString()
    subjectId: number;

    @ApiProperty({ type: Number })
    @IsString()
    fileType: number;

    @ApiProperty({ type: 'file', format: 'file', required: true })
    file: Express.Multer.File
}

