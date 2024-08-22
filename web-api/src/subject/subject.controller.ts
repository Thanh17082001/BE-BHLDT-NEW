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
import { SubjectService } from './subject.service';
import { CreateSubjectDto } from './dtos/create-subject.dto';
import { UpdateSubjectDto } from './dtos/update-subject.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { SubjectDto } from './dtos/subject.dto';
import { QuerySubjectDto } from './dtos/query-subject.dto';
import { PageOptionsDto } from 'src/utils/dtos/pageoptions-dto';
import { ItemDto, PageDto } from 'src/utils/dtos/page-dto';
import { transformToDto } from 'src/utils/transformToDto';
import { ApiTags } from '@nestjs/swagger';
import { Subject } from './entities/subject.entity';

@Controller('subject')
  @ApiTags('subject')
export class SubjectController {
  constructor(private readonly classService: SubjectService) { }

  @Post('/')
  async createSubject(@Body() body: CreateSubjectDto) {

    return this.classService.create(body);
  }
  @Get()
  async findAllSubjects(@Query() classQuery: QuerySubjectDto, @Query() pageOptionDto: PageOptionsDto): Promise<PageDto<Subject>> {
    return await this.classService.find(classQuery, pageOptionDto);
  }
  @Put(':id')
  async updateSubject(@Param('id') id: number, @Body() updateSubjectDto: UpdateSubjectDto) {
    return await this.classService.update(+id, updateSubjectDto);
  }

  @Delete(':id')
  removeSubject(@Param('id') id: number) {
    return this.classService.remove(+id);
  }
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<ItemDto<Subject>> {
    let entity = await this.classService.findOne(id);
    return entity
  }

}
