import { Province } from './../province/entities/supplier.entity';
import { LessonPlan } from 'src/lesson-plan/entities/lesson-plan.entity';
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
  ClassSerializerInterceptor,
  Request,
  UnauthorizedException,
  Query,
} from '@nestjs/common';
import { DistrictService } from './district.service';
import { CreateDistrictDto } from './dtos/create-district.dto';
import { UpdateDistrictDto } from './dtos/update-district.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { DistrictDto } from './dtos/district.dto';
import { QueryDistrictDto } from './dtos/query-district.dto';
import { PageOptionsDto } from 'src/utils/dtos/pageoptions-dto';
import { PageDto } from 'src/utils/dtos/page-dto';
import { transformToDto } from 'src/utils/transformToDto';
import { ApiTags } from '@nestjs/swagger';
import { HttpService } from '@nestjs/axios';
import { PageMetaDto } from 'src/utils/dtos/pagemeta-dto';

@Controller('district')
@ApiTags('district')
@UseInterceptors(ClassSerializerInterceptor)
export class DistrictController {
  constructor(private readonly districtService: DistrictService, private readonly httpService: HttpService) { }

  @Post('/')
  async createDistrict() {

    const responseProvice = await this.httpService.get('https://vapi.vnappmob.com/api/province').toPromise()
    const provinces = responseProvice.data.results;
    const arrIdProvice:Array<number> = provinces.map(item => item.province_id)
    for (let i = 0; i < arrIdProvice.length; i++){
      const resDistricts = await this.httpService.get(`https://vapi.vnappmob.com/api/province/district/${arrIdProvice[i]}`).toPromise()
      const districts = resDistricts.data.results
      for (let j = 0; j < districts.length; j++){
        const data: CreateDistrictDto = {
          name: districts[j].district_name ?? '',
          code: +districts[j].district_id,
          province: districts[j].province_id
        }
        this.districtService.create(data);
      }
    }
  }
  @Get()
  async findAllDistricts(@Query() districtQuery: QueryDistrictDto, @Query() pageOptionDto: PageOptionsDto): Promise<PageDto<DistrictDto>> {
    return await this.districtService.find(districtQuery, pageOptionDto);
  }
  @Put(':id')
  async updateDistrict(@Param('id') id: number, @Body() updateDistrictDto: UpdateDistrictDto) {
    return await this.districtService.update(+id, updateDistrictDto);
  }

  @Delete(':id')
  removeDistrict(@Param('id') id: number) {
    return this.districtService.remove(+id);
  }
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<DistrictDto> {
    let entity = await this.districtService.findOne(id);
    return transformToDto(DistrictDto, entity) as DistrictDto;
  }

  @Get('name/:name')
  async findByName(@Param('name') name: string): Promise<DistrictDto> {
    let entity = await this.districtService.findByName(name);
    return transformToDto(DistrictDto, entity) as DistrictDto;
  }

  @Get('province/:code')
  async findByIdProvince(@Param('code') code: number): Promise<PageDto<DistrictDto>> {
    let entity = await this.districtService.findByIdProvince(code);
    const pageMetaDto = new PageMetaDto({ pageOptionsDto: new PageOptionsDto(), itemCount:entity.length });
    return new PageDto(entity, pageMetaDto);
  }

}
