import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Query, Req, Put } from '@nestjs/common';
import { ElearningVideoService } from './elearning-video.service';
import { CreateElearningVideoDto } from './dto/create-elearning-video.dto';
import { UpdateElearningVideoDto } from './dto/update-elearning-video.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import * as fs from 'fs';
import * as path from 'path';
import { privateFileName } from 'src/utils/filename-private';
import { normalizeString } from 'src/utils/removeVietnamese';
import { cutFilePath } from 'src/utils/cut-file-url';
import { PageOptionsDto } from 'src/utils/dtos/pageoptions-dto';
import { ElearningVideo } from './entities/elearning-video.entity';

@Controller('elearning-video')
  @ApiTags('elearning-video')
export class ElearningVideoController {
  constructor(private readonly elearningVideoService: ElearningVideoService) {}

  @Post()
     @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileInterceptor('file'))
  create(@UploadedFile() file: Express.Multer.File, @Body() createElearningVideoDto: CreateElearningVideoDto) {
    console.log(1);
    const folderPath = path.join(__dirname, '..', '..', 'public', 'elearning-video');
    let videoPath = path.join(__dirname, '..', '..', '/public/elearning-video', privateFileName(normalizeString(file.originalname)));
    videoPath = videoPath.replace(/\\/g, '/');
    console.log(file.mimetype);
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
    else if (file.mimetype == 'video/mp4') {
      createElearningVideoDto.minetype = 'video'
    }
    else if (file.mimetype == 'application/octet-stream') {
      createElearningVideoDto.minetype = '3D'
    }
    else if (file.mimetype == 'audio/mpeg') {
      createElearningVideoDto.minetype = 'audio'
    }
    else {
      createElearningVideoDto.minetype = 'image'
    }
    fs.writeFileSync(videoPath, file.buffer);
               const linkFile = cutFilePath(videoPath, path.join(__dirname,'..','..', '/public/'));
    createElearningVideoDto.path = linkFile;

    return this.elearningVideoService.create(createElearningVideoDto);
  }

   @Get()
    async findAll(@Query() pageOptionDto: PageOptionsDto, @Query() query: Partial<ElearningVideo>, @Req() request: Request) {
      return this.elearningVideoService.findAll(pageOptionDto, query);
    }
  
    @Get(':id')
    findOne(@Param('id') id: string) {
      console.log(4);

      return this.elearningVideoService.findOne(+id);
    }
  
    // @Put(':id')
    // update(@Param('id') id: string, @Body() updateElearningDto: UpdateElearningVideoDto) {
    //   return this.elearningVideoService.update(+id, updateElearningDto);
    // }
  
  @Delete()
  remove(@Query('path') path: string) {
    console.log(3);
    return this.elearningVideoService.remove(path);
  }
}
