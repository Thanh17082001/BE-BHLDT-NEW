import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put } from '@nestjs/common';
import { AnswerService } from './answer.service';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';
import { ApiTags } from '@nestjs/swagger';
import { Answer } from './entities/answer.entity';
import { PageOptionsDto } from 'src/utils/dtos/pageoptions-dto';
import { ItemDto, PageDto } from 'src/utils/dtos/page-dto';

@Controller('answer')
@ApiTags('answer')
export class AnswerController {
  constructor(private readonly answerService: AnswerService) {}

  @Post()
  async create(@Body() createLevelDto: CreateAnswerDto) :Promise<Answer>{
    try {
      return this.answerService.create(createLevelDto);
    } catch (error) {
      console.log(error);
    }
  }


  @Get()
  findAll(@Query() query: Partial<CreateAnswerDto>, @Query() pageOptionDto: PageOptionsDto):Promise<PageDto<Answer>> {
    return this.answerService.findAll(pageOptionDto,query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) :Promise<ItemDto<Answer>> {
    return await this.answerService.findOne(+id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateTypeQuestionDto: UpdateAnswerDto): Promise<Answer> {
    return this.answerService.update(+id, updateTypeQuestionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) :Promise<Answer>{
    return this.answerService.remove(+id);
  }
}

