import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put } from '@nestjs/common';
import { QuestionService } from './question.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { ApiTags } from '@nestjs/swagger';
import { Question } from './entities/question.entity';
import { PageOptionsDto } from 'src/utils/dtos/pageoptions-dto';
import { ItemDto, PageDto } from 'src/utils/dtos/page-dto';
import { RandomQuestionDto } from './dto/randoom-question.dto';

@Controller('question')
@ApiTags('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Post()
  async create(@Body() createQuestionDto: CreateQuestionDto) {
    try {
      return this.questionService.create(createQuestionDto);
    } catch (error) {
      console.log(error);
    }
  }

  @Get()
  findAll(@Query() query: Partial<Question>, @Query() pageOptionDto: PageOptionsDto):Promise<PageDto<Question>> {
    return this.questionService.findAll(pageOptionDto,query);
  }

  @Post('/random')
  getRandomItems(@Body() randomqestTionDto: RandomQuestionDto): Promise<Array<Question>> {
    return this.questionService.getRandomItems(randomqestTionDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string):Promise<ItemDto<Question>> {
    return await this.questionService.findOne(+id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateQuestionDto: UpdateQuestionDto):Promise<Question> {
    return this.questionService.update(+id, updateQuestionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.questionService.remove(+id);
  }
}

