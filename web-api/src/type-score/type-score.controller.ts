import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put } from '@nestjs/common';
import { TypeScoreService } from './type-score.service';
import { CreateTypeScoreDto } from './dto/create-type-score.dto';
import { UpdateTypeScoreDto } from './dto/update-type-score.dto';
import { ApiTags } from '@nestjs/swagger';
import { TypeScore } from './entities/type-score.entity';
import { PageOptionsDto } from 'src/utils/dtos/pageoptions-dto';
import { ItemDto, PageDto } from 'src/utils/dtos/page-dto';
import { TypeQuestion } from 'src/type-question/entities/type-question.entity';

@Controller('type-score')
 @ApiTags('type-score')
export class TypeScoreController {
  constructor(private readonly typeScoreService: TypeScoreService) {}

  @Post()
  async create(@Body() createLevelDto: CreateTypeScoreDto) :Promise<TypeScore>{
    try {
      return this.typeScoreService.create(createLevelDto);
    } catch (error) {
      console.log(error);
    }
  }


  @Get()
  findAll(@Query() query: Partial<CreateTypeScoreDto>, @Query() pageOptionDto: PageOptionsDto):Promise<PageDto<TypeScore>> {
    return this.typeScoreService.findAll(pageOptionDto,query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) :Promise<ItemDto<TypeScore>> {
    return await this.typeScoreService.findOne(+id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateTypeQuestionDto: UpdateTypeScoreDto): Promise<TypeScore> {
    return this.typeScoreService.update(+id, updateTypeQuestionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) :Promise<TypeScore>{
    return this.typeScoreService.remove(+id);
  }
}
