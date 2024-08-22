import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors, UploadedFile } from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { BookInterface } from './interface/book.interface';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { PageOptionsDto } from 'src/utils/dtos/pageoptions-dto';
import { PageDto } from 'src/utils/dtos/page-dto';
import { FileInterceptor } from '@nestjs/platform-express';
import * as path from 'path';
import * as fs from 'fs';
import { normalizeString } from 'src/utils/removeVietnamese';
import { v4 as uuidv4 } from 'uuid';

@Controller('book')
@ApiTags('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async create(@UploadedFile() file: Express.Multer.File,@Body() createBookDto: CreateBookDto) {
    try {
       const nameFile = `${uuidv4()}_${normalizeString(file.originalname)}`
      const imagePath = path.join(__dirname,'..','..', '/public/book', nameFile);
       fs.writeFileSync(imagePath, file.buffer);
      const linkFile :string = `book/${nameFile}`
      const data: CreateBookDto = {
        ...createBookDto,
        linkFile
      }
      return this.bookService.create(data);
    } catch (error) {
      console.log(error);
    }
  }

  @Get()
  findAll(@Query() query: Partial<BookInterface>, @Query() pageOptionDto: PageOptionsDto):Promise<PageDto<BookInterface>> {
    return this.bookService.findAll(pageOptionDto,query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) :Promise<BookInterface> {
    return await this.bookService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto):Promise<BookInterface> {
    return this.bookService.update(+id, updateBookDto);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.bookService.remove(+id);
  // }
}