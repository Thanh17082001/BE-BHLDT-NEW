import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateCovertFileDocxDto } from './create-covert-file.dto';

export class CreateCovertFileRtfDto {
    @ApiProperty({ type: 'file', format: 'file', required: true })
    file:  Express.Multer.File
}
