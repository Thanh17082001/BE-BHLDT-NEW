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
import { TopicFileService } from './topicfile.service';
import { CreateTopicFileDto } from './dtos/create-topicfile.dto';
import { UpdateTopicFileDto } from './dtos/update-topicfile.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { TopicFileDto } from './dtos/topicfile.dto';
import { QueryTopicFileDto } from './dtos/query-topicfile.dto';
import { PageOptionsDto } from 'src/utils/dtos/pageoptions-dto';
import { PageDto } from 'src/utils/dtos/page-dto';
import { transformToDto } from 'src/utils/transformToDto';
import { ApiTags } from '@nestjs/swagger';

@Controller('topic-file')
  @ApiTags('topic-file')
export class TopicFileController {
  constructor(private readonly classService: TopicFileService) { }

  @Post('/')
  async createTopicFile(@Body() body: CreateTopicFileDto) {
    return this.classService.create(body);
  }
  @Get()
  async findAllTopicFiles(@Query() classQuery: QueryTopicFileDto, @Query() pageOptionDto: PageOptionsDto): Promise<PageDto<TopicFileDto>> {
    return await this.classService.find(classQuery, pageOptionDto);
  }
  @Put(':id')
  async updateTopicFile(@Param('id') id: number, @Body() updateTopicFileDto: UpdateTopicFileDto) {
    return await this.classService.update(+id, updateTopicFileDto);
  }

  @Delete(':id')
  removeTopicFile(@Param('id') id: number) {
    return this.classService.remove(+id);
  }
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<TopicFileDto> {
    let entity = await this.classService.findOne(id);
    return transformToDto(TopicFileDto, entity) as TopicFileDto;
  }

}
