import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Query, UploadedFiles, Put, BadRequestException } from '@nestjs/common';
import { LessonPlanService } from './lesson-plan.service';
import { CreateLessonPlanDto } from './dto/create-lesson-plan.dto';
import { UpdateLessonPlanDto } from './dto/update-lesson-plan.dto';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import * as path from 'path';
import * as fs from 'fs';
import { LessonPlanInterFace } from './interface/lesson-plan.interface';
import { ItemDto, PageDto } from 'src/utils/dtos/page-dto';
import { PageOptionsDto } from 'src/utils/dtos/pageoptions-dto';
import { v4 as uuidv4 } from 'uuid';
import { CovertFileService } from 'src/covert-file/covert-file.service';
import { normalizeString } from 'src/utils/removeVietnamese';

@Controller('lesson-plan')
@ApiTags('lesson-plan')
export class LessonPlanController {
  constructor(private readonly lessonPlanService: LessonPlanService, private readonly covertFileService: CovertFileService) { }

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async create(@UploadedFile() file: Express.Multer.File, @Body() createLessonPlanDto: CreateLessonPlanDto) {
    try {
      let previewImage: string = ''
      let pathPtt: string = ''
      //ptt
      if (file.mimetype == 'application/vnd.openxmlformats-officedocument.presentationml.presentation') {
        previewImage = 'image/image-ptt.png'
        const nameFile = `${uuidv4()}_${normalizeString(file.originalname)}`
        const pttPath = path.join(__dirname, '..', '..', '/public/ptt', nameFile);
        fs.writeFileSync(pttPath, file.buffer);
        pathPtt = `ptt/${nameFile}`
      }
      //word
      else {
        previewImage = 'image/image-word.png'
        const nameFile = `${uuidv4()}_${normalizeString(file.originalname)}`
        const pttPath = path.join(__dirname, '..', '..', '/public/word', nameFile);
        fs.writeFileSync(pttPath, file.buffer);
        pathPtt = `word/${nameFile}`
      }


      const data = {
        name: createLessonPlanDto.name,
        topic: createLessonPlanDto.topic,
        path: pathPtt,
        previewImage: previewImage,
        subjectId: Number(createLessonPlanDto.subjectId),
        fileType: +createLessonPlanDto.fileType
      }
      return this.lessonPlanService.create(data);
    } catch (error) {
      console.log(error);
    }
  }

  @Get()
  findAll(@Query() query: Partial<LessonPlanInterFace>, @Query() pageOptionDto: PageOptionsDto): Promise<PageDto<LessonPlanInterFace>> {
    return this.lessonPlanService.findAll(pageOptionDto, query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ItemDto<LessonPlanInterFace>> {
    return await this.lessonPlanService.findOne(+id);
  }

  @Put(':id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async update(@UploadedFile() file: Express.Multer.File, @Param('id') id: string, @Body() updateLessonDto: UpdateLessonPlanDto): Promise<LessonPlanInterFace> {
    try {
      const lesson = await this.lessonPlanService.findOne(+id)
      let previewImage: string = ''
      let pathPtt: string = ''
      if (!lesson) {
        throw new BadRequestException('Lesson is not found')
      }
      //ptt
      if (file.mimetype == 'application/vnd.openxmlformats-officedocument.presentationml.presentation') {
        previewImage = 'image/image-ptt.png'
        const nameFile = `${uuidv4()}_${normalizeString(file.originalname)}`
        const pttPath = path.join(__dirname, '..', '..', '/public/ptt', nameFile);
        fs.writeFileSync(pttPath, file.buffer);
        pathPtt = `ptt/${nameFile}`
        const pttPathOld = path.join(__dirname, '..', '..', '/public', lesson.data?.path);
        fs.unlinkSync(pttPathOld);

      }
      //word
      else {
        previewImage = 'image/image-word.png'
        const nameFile = `${uuidv4()}_${normalizeString(file.originalname)}`
        const pttPath = path.join(__dirname, '..', '..', '/public/word', nameFile);
        fs.writeFileSync(pttPath, file.buffer);
        pathPtt = `word/${nameFile}`
        const pttPathOld = path.join(__dirname, '..', '..', '/public', lesson?.data.path);
        fs.unlinkSync(pttPathOld);
      }
      const data = {
        name: updateLessonDto.name,
        topic: updateLessonDto.topic,
        path: pathPtt,
        previewImage: previewImage,
        subjectId: Number(updateLessonDto.subjectId),
        fileType: +updateLessonDto.fileType
      }
      return this.lessonPlanService.update(+id, data);
    } catch (error) {
      console.log(error);
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lessonPlanService.remove(+id);
  }
}
