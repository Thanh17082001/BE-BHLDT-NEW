import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ImageService } from './image.service';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { ApiTags } from '@nestjs/swagger';
import { Image } from './entities/image.entity';
import { PageOptionsDto } from 'src/utils/dtos/pageoptions-dto';
import { PageDto } from 'src/utils/dtos/page-dto';
import { transformToDto } from 'src/utils/transformToDto';

@Controller('image')
@ApiTags('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) { }

  @Post('/')
  async create(@Body() body: CreateImageDto) {

    return this.imageService.create(body);
  }
  @Get()
  async findAll(@Query() classQuery: Image, @Query() pageOptionDto: PageOptionsDto): Promise<PageDto<Image>> {
    return await this.imageService.findAll( pageOptionDto, classQuery);
  }
  

  @Delete(':id')
  removeSubject(@Param('id') id: number) {
    return this.imageService.remove(+id);
  }
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Image> {
    let entity = await this.imageService.findOne(id);
    return transformToDto(Image, entity) as Image;
  }

}
