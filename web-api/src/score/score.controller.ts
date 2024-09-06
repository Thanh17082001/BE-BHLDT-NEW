import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Query } from '@nestjs/common';
import { TypeScoreService } from './score.service';
import { CreateScoreDto } from './dto/create-score.dto';
import { UpdateScoreDto } from './dto/update-score.dto';
import { Score } from './entities/score.entity';
import { ItemDto, PageDto } from 'src/utils/dtos/page-dto';
import { PageOptionsDto } from 'src/utils/dtos/pageoptions-dto';
import { ApiTags } from '@nestjs/swagger';
import { StudentService } from 'src/student/student.service';
import { QueryScore } from './dto/query-student.dto';
import { StatisticalDto } from './dto/statistical-dto';

@Controller('score')
@ApiTags('score')
export class ScoreController {
  constructor(
    private readonly typeScoreService: TypeScoreService,
    // private readonly studentService: StudentService,
  ) { }
  @Post()
  async create(@Body() createTypeScoreDto: CreateScoreDto) {
    try {
      return this.typeScoreService.create(createTypeScoreDto);
    } catch (error) {
      console.log(error);
    }
  }

  @Get()
  findAll(@Query() query: Partial<Score>, @Query() pageOptionDto: PageOptionsDto):Promise<PageDto<Score>> {
    return this.typeScoreService.findAll(pageOptionDto,query);
  }

  @Get('statistical')
  statistical(@Query() statisticalDto: StatisticalDto) {
    return this.typeScoreService.statistical(statisticalDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ItemDto<Score>> {
    return await this.typeScoreService.findOne(+id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateTypeScoreDto: UpdateScoreDto):Promise<Score> {
    return this.typeScoreService.update(+id, updateTypeScoreDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.typeScoreService.remove(+id);
  }
}
