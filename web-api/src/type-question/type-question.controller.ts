import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put } from '@nestjs/common';
import { TypeQuestionService } from './type-question.service';
import { CreateTypeQuestionDto } from './dto/create-type-question.dto';
import { UpdateTypeQuestionDto } from './dto/update-type-question.dto';
import { PageOptionsDto } from 'src/utils/dtos/pageoptions-dto';
import { ItemDto, PageDto } from 'src/utils/dtos/page-dto';
import { TypeQuestion } from './entities/type-question.entity';
import { ApiTags } from '@nestjs/swagger';

@Controller('type-question')
 @ApiTags('type-question')
export class TypeQuestionController {
  constructor(private readonly typeQuestionService: TypeQuestionService) {}

  @Post()
  async create(@Body() createLevelDto: CreateTypeQuestionDto) :Promise<TypeQuestion>{
    try {
      return this.typeQuestionService.create(createLevelDto);
    } catch (error) {
      console.log(error);
    }
  }


  @Get()
  findAll(@Query() query: Partial<CreateTypeQuestionDto>, @Query() pageOptionDto: PageOptionsDto):Promise<PageDto<TypeQuestion>> {
    return this.typeQuestionService.findAll(pageOptionDto,query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) :Promise<ItemDto<TypeQuestion>> {
    return await this.typeQuestionService.findOne(+id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateTypeQuestionDto: UpdateTypeQuestionDto): Promise<TypeQuestion> {
    return this.typeQuestionService.update(+id, updateTypeQuestionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) :Promise<TypeQuestion>{
    return this.typeQuestionService.remove(+id);
  }
}
