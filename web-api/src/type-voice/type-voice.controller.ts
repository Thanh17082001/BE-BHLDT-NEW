import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put } from '@nestjs/common';
import { TypeVoiceService } from './type-voice.service';
import { CreateTypeVoiceDto } from './dto/create-type-voice.dto';
import { UpdateTypeVoiceDto } from './dto/update-type-voice.dto';
import { ApiTags } from '@nestjs/swagger';
import { TypeVoice } from './entities/type-voice.entity';
import { PageOptionsDto } from 'src/utils/dtos/pageoptions-dto';
import { ItemDto, PageDto } from 'src/utils/dtos/page-dto';

@Controller('type-voice')
 @ApiTags('type-voice')
export class TypeVoiceController {
  constructor(private readonly typeScoreService: TypeVoiceService) {}

  @Post()
  async create(@Body() createLevelDto: CreateTypeVoiceDto) :Promise<TypeVoice>{
    try {
      return this.typeScoreService.create(createLevelDto);
    } catch (error) {
      console.log(error);
    }
  }


  @Get()
  findAll(@Query() query: Partial<CreateTypeVoiceDto>, @Query() pageOptionDto: PageOptionsDto):Promise<PageDto<TypeVoice>> {
    return this.typeScoreService.findAll(pageOptionDto,query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) :Promise<ItemDto<TypeVoice>> {
    return await this.typeScoreService.findOne(+id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateTypeQuestionDto: UpdateTypeVoiceDto): Promise<TypeVoice> {
    return this.typeScoreService.update(+id, updateTypeQuestionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) :Promise<TypeVoice>{
    return this.typeScoreService.remove(+id);
  }
}
