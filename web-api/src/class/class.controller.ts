import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put } from '@nestjs/common';
import { ClassService } from './class.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { ApiTags } from '@nestjs/swagger';
import { Class } from './entities/class.entity';
import { PageOptionsDto } from 'src/utils/dtos/pageoptions-dto';
import { ItemDto, PageDto } from 'src/utils/dtos/page-dto';

@Controller('class')
@ApiTags('classes')
export class ClassController {
  constructor(private readonly classService: ClassService) {}

  @Post()
  async create(@Body() createClassDto: CreateClassDto) {
    try {
      return this.classService.create(createClassDto);
    } catch (error) {
      console.log(error);
    }
  }

  @Get()
  findAll(@Query() query: Partial<Class>, @Query() pageOptionDto: PageOptionsDto):Promise<PageDto<Class>> {
    return this.classService.findAll(pageOptionDto,query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string):Promise<ItemDto<Class>> {
    return await this.classService.findOne(+id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateClassDto: UpdateClassDto):Promise<Class> {
    return this.classService.update(+id, updateClassDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.classService.remove(+id);
  }
}
