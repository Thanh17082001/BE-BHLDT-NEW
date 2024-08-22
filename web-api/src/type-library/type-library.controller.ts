import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { TypeLibraryService } from './type-library.service';
import { CreateTypeLibraryDto } from './dto/create-type-library.dto';
import { UpdateTypeLibraryDto } from './dto/update-type-library.dto';
import { PageOptionsDto } from 'src/utils/dtos/pageoptions-dto';
import { PageDto } from 'src/utils/dtos/page-dto';
import { TypeLibraryDto } from './dto/type-library-dto';
import { ApiTags } from '@nestjs/swagger';
import { query } from 'express';

@Controller('type-library')
  @ApiTags('type-library')
export class TypeLibraryController {
  constructor(private readonly typeLibraryService: TypeLibraryService) {}

  @Post()
  async create(@Body() createTypeLibraryDto: CreateTypeLibraryDto) :Promise<TypeLibraryDto>{
    try {
      return this.typeLibraryService.create(createTypeLibraryDto);
    } catch (error) {
      console.log(error);
    }
  }

  @Get()
  findAll(@Query() query: Partial<CreateTypeLibraryDto>, @Query() pageOptionDto: PageOptionsDto): Promise<PageDto<TypeLibraryDto>> {
    return this.typeLibraryService.findAll(pageOptionDto,query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) :Promise<TypeLibraryDto> {
    return await this.typeLibraryService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateTypeLibraryDto: UpdateTypeLibraryDto):Promise<TypeLibraryDto> {
    return this.typeLibraryService.update(+id, updateTypeLibraryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.typeLibraryService.remove(+id);
  }
}
