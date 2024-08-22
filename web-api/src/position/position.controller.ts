import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PositionService } from './position.service';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { ApiTags } from '@nestjs/swagger';
import { PositionInterface } from './interface/position.interface';
import { PageOptionsDto } from 'src/utils/dtos/pageoptions-dto';
import { PageDto } from 'src/utils/dtos/page-dto';
import { SkipPermission } from 'src/permission/permission.decorator';

@Controller('position')
@ApiTags('position')
export class PositionController {
  constructor(private readonly positionService: PositionService) {}

  @Post()
  async create(@Body() createPositionDto: CreatePositionDto):Promise<PositionInterface> {
    try {
      
      return this.positionService.create(createPositionDto);
    } catch (error) {
      console.log(error);
    }
  }

  @Get()
  findAll(@Query() query: Partial<PositionInterface>, @Query() pageOptionDto: PageOptionsDto):Promise<PageDto<PositionInterface>> {
    return this.positionService.findAll(pageOptionDto,query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) :Promise<PositionInterface> {
    return await this.positionService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updatePositionDto: UpdatePositionDto):Promise<PositionInterface> {
    return this.positionService.update(+id, updatePositionDto);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.positionService.remove(+id);
  // }
}