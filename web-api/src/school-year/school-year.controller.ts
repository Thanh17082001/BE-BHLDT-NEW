import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put } from '@nestjs/common';
import { SchoolYearService } from './school-year.service';
import { CreateSchoolYearDto } from './dto/create-school-year.dto';
import { UpdateSchoolYearDto } from './dto/update-school-year.dto';
import { ApiTags } from '@nestjs/swagger';
import { SchoolYear } from './entities/school-year.entity';
import { PageOptionsDto } from 'src/utils/dtos/pageoptions-dto';
import { PageDto } from 'src/utils/dtos/page-dto';

@Controller('school-year')
  @ApiTags('school-year')
export class SchoolYearController {
  constructor(private readonly SchoolYearService: SchoolYearService) {}

  @Post()
  async create(@Body() createSchoolYearDto: CreateSchoolYearDto) :Promise<SchoolYear>{
    try {
      createSchoolYearDto.name = `Năm học ${createSchoolYearDto.startYear} - ${createSchoolYearDto.endYear}`
      return this.SchoolYearService.create(createSchoolYearDto);
    } catch (error) {
      console.log(error);
    }
  }


  @Get()
  findAll(@Query() query: Partial<CreateSchoolYearDto>, @Query() pageOptionDto: PageOptionsDto):Promise<PageDto<SchoolYear>> {
    return this.SchoolYearService.findAll(pageOptionDto,query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) :Promise<SchoolYear> {
    return await this.SchoolYearService.findOne(+id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateTypeLibraryDto: UpdateSchoolYearDto): Promise<SchoolYear> {
    updateTypeLibraryDto.name = `Năm học ${updateTypeLibraryDto.startYear} - ${updateTypeLibraryDto.endYear}`
    return this.SchoolYearService.update(+id, updateTypeLibraryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) :Promise<SchoolYear>{
    return this.SchoolYearService.remove(+id);
  }
}
