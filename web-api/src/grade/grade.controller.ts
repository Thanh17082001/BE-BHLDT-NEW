import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Patch,
  Param,
  Delete,
  NotFoundException,
  UseInterceptors,
  Request,
  UnauthorizedException,
  Query,
} from '@nestjs/common';
import { GradeService } from './grade.service';
import { CreateGradeDto } from './dtos/create-grade.dto';
import { UpdateGradeDto } from './dtos/update-grade.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { GradeDto } from './dtos/grade.dto';
import { QueryGradeDto } from './dtos/query-grade.dto';
import { PageOptionsDto } from 'src/utils/dtos/pageoptions-dto';
import { PageDto } from 'src/utils/dtos/page-dto';
import { transformToDto } from 'src/utils/transformToDto';
import { ApiTags } from '@nestjs/swagger';
import { Grade } from './entities/grade.entity';

@Controller('grade')
  @ApiTags('grade')
export class GradeController {
  constructor(private readonly classService: GradeService) { }

  @Post('/')
  async createGrade(@Body() body: CreateGradeDto) {

    return this.classService.create(body);
  }
  @Get()
  async findAllGrades(@Query() classQuery: QueryGradeDto, @Query() pageOptionDto: PageOptionsDto): Promise<PageDto<GradeDto>> {
    return await this.classService.find(classQuery, pageOptionDto);
  }
  @Put(':id')
  async updateGrade(@Param('id') id: number, @Body() updateGradeDto: UpdateGradeDto) {
    return await this.classService.update(+id, updateGradeDto);
  }

  @Delete(':id')
  removeGrade(@Param('id') id: number) {
    return this.classService.remove(+id);
  }
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Grade> {
    return await this.classService.findOne(id);
  }

}
