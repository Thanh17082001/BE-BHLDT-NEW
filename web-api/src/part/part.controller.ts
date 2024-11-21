import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put } from '@nestjs/common';

import { ApiTags } from '@nestjs/swagger';
import { PageOptionsDto } from 'src/utils/dtos/pageoptions-dto';
import { ItemDto, PageDto } from 'src/utils/dtos/page-dto';
import { PartService } from './part.service';
import { CreatePartDto } from './dto/create-part.dto';
import { Part } from './entities/part.entity';
import { UpdatePartDto } from './dto/update-part.dto';

@Controller('part')
@ApiTags('part')
export class PartController {
  constructor(private readonly partService: PartService) { }

  @Post()
  async create(@Body() createLevelDto: CreatePartDto): Promise<Part> {
    try {
      return this.partService.create(createLevelDto);
    } catch (error) {
      console.log(error);
    }
  }


  @Get()
  findAll(@Query() query: Partial<CreatePartDto>, @Query() pageOptionDto: PageOptionsDto): Promise<PageDto<Part>> {
    return this.partService.findAll(pageOptionDto, query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ItemDto<Part>> {
    return await this.partService.findOne(+id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateTypeQuestionDto: UpdatePartDto): Promise<Part> {
    return this.partService.update(+id, updateTypeQuestionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<Part> {
    return this.partService.remove(+id);
  }
}
