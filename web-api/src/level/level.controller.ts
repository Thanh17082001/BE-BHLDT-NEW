import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put } from '@nestjs/common';
import { LevelService } from './level.service';
import { CreateLevelDto } from './dto/create-level.dto';
import { UpdateLevelDto } from './dto/update-level.dto';
import { ApiTags } from '@nestjs/swagger';
import { Level } from './entities/level.entity';
import { PageOptionsDto } from 'src/utils/dtos/pageoptions-dto';
import { ItemDto, PageDto } from 'src/utils/dtos/page-dto';

@Controller('level')
 @ApiTags('level')
export class LevelController {
  constructor(private readonly levelService: LevelService) {}

  @Post()
  async create(@Body() createLevelDto: CreateLevelDto) :Promise<Level>{
    try {
      return this.levelService.create(createLevelDto);
    } catch (error) {
      console.log(error);
    }
  }


  @Get()
  findAll(@Query() query: Partial<CreateLevelDto>, @Query() pageOptionDto: PageOptionsDto):Promise<PageDto<Level>> {
    return this.levelService.findAll(pageOptionDto,query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) :Promise<ItemDto<Level>> {
    return await this.levelService.findOne(+id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateTypeLibraryDto: UpdateLevelDto): Promise<Level> {
    return this.levelService.update(+id, updateTypeLibraryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) :Promise<Level>{
    return this.levelService.remove(+id);
  }
}
