import { ElearningService } from './elearning.service';
import { CreateElearningDto } from './dto/create-elearning.dto';
import { UpdateElearningDto } from './dto/update-elearning.dto';

import { Controller, Get, Post, Body, Put, Param, Delete, Query, Req, UseGuards } from '@nestjs/common';
import { Elearning } from './entities/elearning.entity';
import { PageOptionsDto } from 'src/utils/dtos/pageoptions-dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('elearning')
@Controller('elearning')
export class ElearningController {
  constructor(private readonly ElearningService: ElearningService) { }

  @Post()
  create(@Body() createElearningDto: CreateElearningDto, @Req() request: Request) {
    return this.ElearningService.create(createElearningDto);
  }

  @Get()
  async findAll(@Query() pageOptionDto: PageOptionsDto, @Query() query: Partial<Elearning>, @Req() request: Request) {
    return this.ElearningService.findAll(pageOptionDto, query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ElearningService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateElearningDto: UpdateElearningDto) {
    return this.ElearningService.update(+id, updateElearningDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() request: Request) {
    const user = request['user'] ?? null;
    return this.ElearningService.remove(+id);
  }
}



