import { Province } from './entities/supplier.entity';
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
import { ProvinceService } from './province.service';
import { CreateProvinceDto } from './dtos/create-province.dto';
import { UpdateProvinceDto } from './dtos/update-province.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { ProvinceDto } from './dtos/province.dto';
import { QueryProvinceDto } from './dtos/query-province.dto';
import { PageOptionsDto } from 'src/utils/dtos/pageoptions-dto';
import { PageDto } from 'src/utils/dtos/page-dto';
import { transformToDto } from 'src/utils/transformToDto';
import { ApiTags } from '@nestjs/swagger';
import { HttpService } from '@nestjs/axios';

@Controller('province')
  @ApiTags('province')
@UseInterceptors(ClassSerializerInterceptor)
export class ProvinceController {
  constructor(private readonly supplierService: ProvinceService, private readonly httpService: HttpService) { }

  @Post('/')
  async createProvince() {
   const response = await this.httpService.get('https://vapi.vnappmob.com/api/province').toPromise()
    const provinces = response.data.results;
    for (let i = 0; i < provinces.length; i++){
      const province: CreateProvinceDto = {
        name: provinces[i].province_name,
        code: provinces[i].province_id
      }
      await this.supplierService.create(province);
    }
  }
  @Get()
  async findAllProvinces(@Query() supplierQuery: QueryProvinceDto, @Query() pageOptionDto: PageOptionsDto): Promise<PageDto<ProvinceDto>> {
    return await this.supplierService.find(supplierQuery, pageOptionDto);
  }
  @Put(':id')
  async updateProvince(@Param('id') id: number, @Body() updateProvinceDto: UpdateProvinceDto) {
    return await this.supplierService.update(+id, updateProvinceDto);
  }

  @Delete(':id')
  removeProvince(@Param('id') id: number) {
    return this.supplierService.remove(+id);
  }
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<ProvinceDto> {
    let entity = await this.supplierService.findOne(id);
    return transformToDto(ProvinceDto, entity) as ProvinceDto;
  }

  @Get('name/:name')
  async findByName(@Param('name') name: string): Promise<ProvinceDto> {
    let entity = await this.supplierService.findByName(name);
    return transformToDto(ProvinceDto, entity) as ProvinceDto;
  }


}
