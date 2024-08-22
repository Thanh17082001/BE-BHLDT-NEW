import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFiles, Query, Put } from '@nestjs/common';
import { LibraryService } from './library.service';
import { CreateLibraryDto } from './dto/create-library.dto';
import { UpdateLibraryDto } from './dto/update-library.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import * as path from 'path';
import * as fs from 'fs';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { LibraryInterface } from './interface/library.interface';
import { PageOptionsDto } from 'src/utils/dtos/pageoptions-dto';
import { PageDto } from 'src/utils/dtos/page-dto';
import { v4 as uuidv4 } from 'uuid';

@Controller('library')
@ApiTags('library')
export class LibraryController {
  constructor(private readonly libraryService: LibraryService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('files'))
  async create(@UploadedFiles() files:    Express.Multer.File[] ,@Body() createLibraryDto: CreateLibraryDto) {
    try {
      let linkImage :string=''
      let pathPtt :string=''
      if (files.length > 0) {
        for (let i = 0; i < files.length; i++){
          const nameFile = `${uuidv4()}_${files[i].originalname}`
          if (files[i].mimetype == 'image/jpg' || files[i].mimetype == 'image/jpeg' || files[i].mimetype == 'image/png') {
            const imagePath = path.join(__dirname, '..', '..', '/public/image', nameFile);
            fs.writeFileSync(imagePath, files[i].buffer);
             linkImage  = `image/${nameFile}`
          }
          else {
            const pttPath = path.join(__dirname, '..', '..', '/public/ptt', nameFile);
            fs.writeFileSync(pttPath, files[i].buffer);
             pathPtt  = `ptt/${nameFile}`
          }
        }
      }
      
      const data = {
        name: createLibraryDto.name,
        path: pathPtt,
        size: Number(createLibraryDto.size),
        subjectId: createLibraryDto.subjectId,
        gradeId: createLibraryDto.gradeId,
        topicId: createLibraryDto.topicId,
        bookId: Number(createLibraryDto.bookId),
        typeId: Number(createLibraryDto.typeId),
        linkImage : linkImage ? linkImage : null
      }
      return this.libraryService.create(data);
    } catch (error) {
      console.log(error);
    }
  }

  @Get()
  findAll(@Query() query: Partial<LibraryInterface>, @Query() pageOptionDto: PageOptionsDto):Promise<PageDto<LibraryInterface>> {
    return this.libraryService.findAll(pageOptionDto,query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) :Promise<LibraryInterface> {
    return await this.libraryService.findOne(+id);
  }

  @ApiConsumes('multipart/form-data')
   @UseInterceptors(FilesInterceptor('files'))
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateLibraryDto: UpdateLibraryDto):Promise<LibraryInterface> {
    return this.libraryService.update(+id, updateLibraryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.libraryService.remove(+id);
  }
}
