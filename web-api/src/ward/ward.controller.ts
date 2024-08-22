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
import { WardService } from './ward.service';
import { CreateWardDto } from './dtos/create-ward.dto';
import { UpdateWardDto } from './dtos/update-ward.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { WardDto } from './dtos/ward.dto';
import { QueryWardDto } from './dtos/query-ward.dto';
import { PageOptionsDto } from 'src/utils/dtos/pageoptions-dto';
import { PageDto } from 'src/utils/dtos/page-dto';
import { transformToDto } from 'src/utils/transformToDto';
import { ApiTags } from '@nestjs/swagger';
import { DistrictService } from 'src/district/district.service';
import { HttpService } from '@nestjs/axios';
import { PageMetaDto } from 'src/utils/dtos/pagemeta-dto';
import { Province } from 'src/province/entities/supplier.entity';

@Controller('ward')
  @ApiTags('ward')
@UseInterceptors(ClassSerializerInterceptor)
export class WardController {
  constructor(private readonly wardService: WardService, private readonly districtService: DistrictService, private readonly httpService: HttpService) { }

  @Post('/')
  async createWard() {
   const districts = await this.districtService.find2()
    const codeDis: Array<number> = districts.map(item => item.code)
    for (let i = 0; i < codeDis.length; i++){
      const response = await this.httpService.get(`https://vapi.vnappmob.com/api/province/ward/${codeDis[i]}`).toPromise()
      const wards = response.data.results
      for (let j = 0; j < wards.length; j++){
        const data: CreateWardDto = {
          name: wards[j].ward_name,
          code: wards[j].ward_id,
          district:wards[j].district_id
        }
        await this.wardService.create(data)
      }
    }
  }
  @Get()
  async findAllWards(@Query() wardQuery: QueryWardDto, @Query() pageOptionDto: PageOptionsDto): Promise<PageDto<WardDto>> {
    return await this.wardService.find(wardQuery, pageOptionDto);
  }
  @Put(':id')
  async updateWard(@Param('id') id: number, @Body() updateWardDto: UpdateWardDto) {
    return await this.wardService.update(+id, updateWardDto);
  }

  @Delete(':id')
  removeWard(@Param('id') id: number) {
    return this.wardService.remove(+id);
  }
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<WardDto> {
    let entity = await this.wardService.findOne(id);
    return transformToDto(WardDto, entity) as WardDto;
  }

  @Get('name/:name')
  async findByName(@Param('name') name: string): Promise<WardDto> {
    let entity = await this.wardService.findOneByWardName(name);
    return transformToDto(WardDto, entity) as WardDto;
  }

  @Get('district/:code')
   async findByIdProvince(@Param('code') code: number): Promise<PageDto<Province>> {
    let entity = await this.wardService.findByIdDistrict(code);
    const pageMetaDto = new PageMetaDto({ pageOptionsDto: new PageOptionsDto(), itemCount:entity.length });
    return new PageDto(entity, pageMetaDto);
  }

}
