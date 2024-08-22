import { ApiProperty } from "@nestjs/swagger";

export class CreateCovertFileDocxDto {
    @ApiProperty({ type: 'file', format: 'file', required: true })
    file:  Express.Multer.File
}
