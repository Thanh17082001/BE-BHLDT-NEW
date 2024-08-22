import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put } from '@nestjs/common';
import { SchoolService } from './school.service';
import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';
import { ApiTags } from '@nestjs/swagger';
import { PageOptionsDto } from 'src/utils/dtos/pageoptions-dto';
import { PageDto } from 'src/utils/dtos/page-dto';
import { SchoolInterface } from './interface/school.interface';
import { AddGradesDto } from './dto/add-grade-scholl';
import { SearchDto } from './dto/search-dto';

@Controller('school')
@ApiTags('school')
export class SchoolController {
  constructor(private readonly schoolService: SchoolService) {}

  @Post()
  async create(@Body() createSchoolDto: CreateSchoolDto) :Promise<SchoolInterface>{
    try {
      return this.schoolService.create(createSchoolDto);
    } catch (error) {
      console.log(error);
    }
  }

   @Post('add-grades')
  async addGrades(@Body() addGradesDto: AddGradesDto) :Promise<SchoolInterface>{
     try {
      return this.schoolService.addgrades(addGradesDto);
    } catch (error) {
      console.log(error);
    }
  }

  @Get()
  findAll(@Query() query: Partial<CreateSchoolDto>, @Query() pageOptionDto: PageOptionsDto):Promise<PageDto<SchoolInterface>> {
    return this.schoolService.findAll(pageOptionDto,query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) :Promise<SchoolInterface> {
    return await this.schoolService.findOne(+id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateTypeLibraryDto: UpdateSchoolDto):Promise<SchoolInterface> {
    return this.schoolService.update(+id, updateTypeLibraryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.schoolService.remove(+id);
  }
}

