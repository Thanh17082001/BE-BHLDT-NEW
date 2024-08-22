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
import { TopicService } from './topic.service';
import { CreateTopicDto } from './dtos/create-topic.dto';
import { UpdateTopicDto } from './dtos/update-topic.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { TopicDto } from './dtos/topic.dto';
import { QueryTopicDto } from './dtos/query-topic.dto';
import { PageOptionsDto } from 'src/utils/dtos/pageoptions-dto';
import { PageDto } from 'src/utils/dtos/page-dto';
import { transformToDto } from 'src/utils/transformToDto';
import { ApiTags } from '@nestjs/swagger';
import { Topic } from './entities/topic.entity';

@Controller('topic')
  @ApiTags('topic')
export class TopicController {
  constructor(private readonly classService: TopicService) { }

  @Post('/')
  async createTopic(@Body() body: CreateTopicDto) {
    console.log("createdsds", body);
    return this.classService.create(body);
  }
  @Get()
  async findAllTopics(@Query() classQuery: QueryTopicDto, @Query() pageOptionDto: PageOptionsDto): Promise<PageDto<Topic>> {
    return await this.classService.find(classQuery, pageOptionDto);
  }
  @Put(':id')
  async updateTopic(@Param('id') id: number, @Body() updateTopicDto: UpdateTopicDto) {
    return await this.classService.update(+id, updateTopicDto);
  }

  @Delete(':id')
  removeTopic(@Param('id') id: number) {
    return this.classService.remove(+id);
  }
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<TopicDto> {
    let entity = await this.classService.findOne(id);
    return transformToDto(TopicDto, entity) as TopicDto;
  }

}
