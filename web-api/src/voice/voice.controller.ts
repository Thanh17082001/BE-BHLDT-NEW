import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Query, Put } from '@nestjs/common';
import { VoiceService } from './voice.service';
import { CreateVoiceDto } from './dto/create-voice.dto';
import { UpdateVoiceDto } from './dto/update-voice.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import * as fs from 'fs';
import * as path from 'path';
import { privateFileName } from 'src/utils/filename-private';
import { normalizeString } from 'src/utils/removeVietnamese';
import { cutFilePath } from 'src/utils/cut-file-url';
import { PageOptionsDto } from 'src/utils/dtos/pageoptions-dto';
import { ItemDto, PageDto } from 'src/utils/dtos/page-dto';
import { Voice } from './entities/voice.entity';

@Controller('voice')
  @ApiTags('voice')
export class VoiceController {
  constructor(private readonly voiceService: VoiceService) {}

  @Post()
    @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  create(@UploadedFile() file: Express.Multer.File, @Body() createVoiceDto: CreateVoiceDto) {
    let link:string = '';
    if (file) {
       const voicePath = path.join(__dirname,'..','..', '/public/voice', privateFileName(normalizeString(file.originalname)));
      fs.writeFileSync(voicePath, file.buffer);
      link = cutFilePath(voicePath, path.join(__dirname, '..', '..', '/public/'));
      const data: CreateVoiceDto = {
        ...createVoiceDto,
        link: link,
      }
      return this.voiceService.create(data);
    }
    else {
      return 'chưa có làm truyền text lên ă'
      // const data: CreateVoiceDto = {
      //   ...createVoiceDto,
      //   link: ''
      // }
      // return this.voiceService.create(data);
    }
  }

  @Get()
  findAll(@Query() query: Partial<CreateVoiceDto>, @Query() pageOptionDto: PageOptionsDto):Promise<PageDto<Voice>> {
    return this.voiceService.findAll(pageOptionDto,query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) :Promise<ItemDto<Voice>> {
    return await this.voiceService.findOne(+id);
  }

  @Put(':id')
    @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async update(@UploadedFile() file: Express.Multer.File,@Param('id') id: string, @Body() updateVoiceDto: UpdateVoiceDto): Promise<Voice> {
    const voice = await this.voiceService.findOne(+id)
    
     let link:string = '';
    if (file) {
       const voicePath = path.join(__dirname,'..','..', '/public/voice', privateFileName(normalizeString(file.originalname)));
      fs.writeFileSync(voicePath, file.buffer);
      link = cutFilePath(voicePath, path.join(__dirname, '..', '..', '/public/'));
      const data: UpdateVoiceDto = {
        ...updateVoiceDto,
        link: link,
      }
      const voicePathOld = path.join(__dirname, '..', '..', '/public', voice.data?.link);
      fs.unlinkSync(voicePathOld);
      return this.voiceService.update(+id, updateVoiceDto);
    }
    // else {
    //   return 'chưa có làm truyền text lên ă'
    //   // const data: CreateVoiceDto = {
    //   //   ...createVoiceDto,
    //   //   link: ''
    //   // }
    //   // return this.voiceService.create(data);
    // }
    
  }

  @Delete(':id')
  remove(@Param('id') id: string) :Promise<Voice>{
    return this.voiceService.remove(+id);
  }
}
