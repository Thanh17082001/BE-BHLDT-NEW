import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Query, Put } from '@nestjs/common';
import { VoiceService } from './voice.service';
import { CreateVoiceDto } from './dto/create-voice.dto';
import { UpdateVoiceDto } from './dto/update-voice.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import * as fs from 'fs';
import * as path from 'path';
import { privateFileName } from 'src/utils/filename-private';
import { normalizeString } from 'src/utils/removeVietnamese';
import { cutFilePath } from 'src/utils/cut-file-url';
import { PageOptionsDto } from 'src/utils/dtos/pageoptions-dto';
import { ItemDto, PageDto } from 'src/utils/dtos/page-dto';
import { Voice } from './entities/voice.entity';
import { EdenAiDto } from './dto/data-endenAi.dto';
import { writeFile } from 'fs/promises';

@Controller('voice')
  @ApiTags('voice')
export class VoiceController {
  constructor(private readonly voiceService: VoiceService) {}

  @Post()
    @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  create(@UploadedFile() file: Express.Multer.File, @Body() createVoiceDto: CreateVoiceDto) {
    let link: string = '';
    if (file) {
      const name: string = file.originalname; 
       const voicePath = path.join(__dirname,'..','..', '/public/voice', privateFileName(normalizeString(file.originalname)));
      fs.writeFileSync(voicePath, file.buffer);
      link = cutFilePath(voicePath, path.join(__dirname, '..', '..', '/public/'));
      console.log(createVoiceDto.isGeneral);
      const data: CreateVoiceDto = {
         fileId: +createVoiceDto.fileId,
        order: +createVoiceDto.order,
        isGeneral: (/true/).test(createVoiceDto.isGeneral.toString()),
        typeVoiceId:+createVoiceDto.typeVoiceId,
        link: link,
        name:name
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
      const name: string = file.originalname; 
       const voicePath = path.join(__dirname,'..','..', '/public/voice', privateFileName(normalizeString(file.originalname)));
      fs.writeFileSync(voicePath, file.buffer);
      link = cutFilePath(voicePath, path.join(__dirname, '..', '..', '/public/'));
      const data: UpdateVoiceDto = {
        fileId: +updateVoiceDto.fileId,
        order: +updateVoiceDto.order,
        isGeneral: (/true/).test(updateVoiceDto.isGeneral.toString()),
        typeVoiceId:+updateVoiceDto.typeVoiceId,
        link: link,
        name:name
      }
      const voicePathOld = path.join(__dirname, '..', '..', '/public', voice.data?.link);
      if (fs.existsSync(voicePathOld)) {

        fs.unlinkSync(voicePathOld);
      }
      return this.voiceService.update(+id, data);
    }
    else {
       const data: UpdateVoiceDto = {
        fileId: +updateVoiceDto.fileId,
        order: +updateVoiceDto.order,
        isGeneral: (/true/).test(updateVoiceDto.isGeneral.toString()),
        typeVoiceId:+updateVoiceDto.typeVoiceId,
        link: voice.data.link,
      }
      return this.voiceService.update(+id, data);
    }
    
  }

  @Delete(':id')
  remove(@Param('id') id: string) :Promise<Voice>{
    return this.voiceService.remove(+id);
  }

  @Post('covert-text-to-speech')
  @ApiBody({
    description: 'Text-to-Speech conversion with optional file',
    type: EdenAiDto,
  })
  async convert(@Body() data: EdenAiDto) {
    const audio = await this.voiceService.convertTextToSpeech(data);
    const voicePath = path.join(__dirname, '..', '..', '/public/voice', privateFileName(normalizeString('audio.mp3')));
    const link = cutFilePath(voicePath, path.join(__dirname, '..', '..', '/public/'));
       fs.writeFileSync(voicePath, audio[data.providers].audio);
    return link;
  }
}
