import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Patch,
  Param,
  Delete,
  NotFoundException,
  UseInterceptors,
  Request,
  UnauthorizedException,
  Query,
} from '@nestjs/common';
import { FileTypeService } from './filetype.service';
import { CreateFileTypeDto } from './dtos/create-filetype.dto';
import { UpdateFileTypeDto } from './dtos/update-filetype.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { FileTypeDto } from './dtos/filetype.dto';
import { QueryFileTypeDto } from './dtos/query-filetype.dto';
import { PageOptionsDto } from 'src/utils/dtos/pageoptions-dto';
import { PageDto } from 'src/utils/dtos/page-dto';
import { transformToDto } from 'src/utils/transformToDto';
import { ApiTags } from '@nestjs/swagger';

@Controller('file-type')
  @ApiTags('file-type')
export class FileTypeController {
  constructor(private readonly classService: FileTypeService) { }

  @Post('/')
  async createFileType(@Body() body: CreateFileTypeDto) {
    return this.classService.create(body);
  }
  @Get()
  async findAllFileTypes(@Query() classQuery: QueryFileTypeDto, @Query() pageOptionDto: PageOptionsDto): Promise<PageDto<FileTypeDto>> {
    return await this.classService.find(classQuery, pageOptionDto);
  }
  @Put(':id')
  async updateFileType(@Param('id') id: number, @Body() updateFileTypeDto: UpdateFileTypeDto) {
    return await this.classService.update(+id, updateFileTypeDto);
  }

  @Delete(':id')
  removeFileType(@Param('id') id: number) {
    return this.classService.remove(+id);
  }
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<FileTypeDto> {
    let entity = await this.classService.findOne(id);
    return transformToDto(FileTypeDto, entity) as FileTypeDto;
  }

}
