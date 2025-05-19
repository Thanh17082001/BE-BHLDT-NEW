import { ElearningThemeService } from './elearning-theme.service';
import { CreateElearningThemeDto } from './dto/create-elearning-theme.dto';
import { UpdateElearningThemeDto } from './dto/update-elearning-theme.dto';

import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Query, Req, Put } from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import * as fs from 'fs';
import * as path from 'path';
import { privateFileName } from 'src/utils/filename-private';
import { normalizeString } from 'src/utils/removeVietnamese';
import { cutFilePath } from 'src/utils/cut-file-url';
import { PageOptionsDto } from 'src/utils/dtos/pageoptions-dto';
import { ElearningTheme } from './entities/elearning-theme.entity';

@Controller('elearning-theme')
  @ApiTags('elearning-theme')
export class ElearningThemeController {
  constructor(private readonly ElearningThemeService: ElearningThemeService) {}

  @Post()
     @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileInterceptor('file'))
  create( @UploadedFile() file: Express.Multer.File,@Body() createElearningThemeDto: CreateElearningThemeDto) {
    const folderPath = path.join(__dirname, '..', '..', 'public', 'elearning-theme');
    const themePath = path.join(__dirname,'..','..', '/public/elearning-theme', privateFileName(normalizeString(file.originalname)));
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
  
    fs.writeFileSync(themePath, file.buffer);
    const linkFile = cutFilePath(themePath, path.join(__dirname,'..','..', '/public/'));
    createElearningThemeDto.path = linkFile;

    return this.ElearningThemeService.create(createElearningThemeDto);
  }

   @Get()
    async findAll(@Query() pageOptionDto: PageOptionsDto, @Query() query: Partial<ElearningTheme>, @Req() request: Request) {
      return this.ElearningThemeService.findAll(pageOptionDto, query);
    }
  
    @Get(':id')
    findOne(@Param('id') id: string) {
      return this.ElearningThemeService.findOne(+id);
    }
  
  @Put(':id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  update(@UploadedFile() file: Express.Multer.File, @Param('id') id: string, @Body() updateElearningDto: UpdateElearningThemeDto) {
    if (file) {
      const folderPath = path.join(__dirname, '..', '..', 'public', 'elearning-theme');
      const themePath = path.join(__dirname, '..', '..', '/public/elearning-theme', privateFileName(normalizeString(file.originalname)));
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
      }

      const filePath = path.join(__dirname, '..', '..', 'public', updateElearningDto.path);
      
          // Kiểm tra và xóa file
          if (fs.existsSync(filePath)) {
            try {
              fs.unlinkSync(filePath); // Xoá đồng bộ
            } catch (err) {
              console.error('Lỗi khi xoá file:', err);
              // Tuỳ chọn: throw new InternalServerErrorException('Không thể xoá file vật lý');
            }
          }

      fs.writeFileSync(themePath, file.buffer);
      const linkFile = cutFilePath(themePath, path.join(__dirname, '..', '..', '/public/'));
      updateElearningDto.path = linkFile;
    }
      return this.ElearningThemeService.update(+id, updateElearningDto);
    }
  
    @Delete(':id')
    remove(@Param('id') id: string) {
      return this.ElearningThemeService.remove(+id);
    }
}
