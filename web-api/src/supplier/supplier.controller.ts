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
import { SupplierService } from './supplier.service';
import { CreateSupplierDto } from './dtos/create-supplier.dto';
import { UpdateSupplierDto } from './dtos/update-supplier.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { SupplierDto } from './dtos/supplier.dto';
import { QuerySupplierDto } from './dtos/query-supplier.dto';
import { PageOptionsDto } from 'src/utils/dtos/pageoptions-dto';
import { PageDto } from 'src/utils/dtos/page-dto';
import { transformToDto } from 'src/utils/transformToDto';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/decorators/customize.decorator';
import { SkipPermission } from 'src/permission/permission.decorator';

@Controller('supplier')
@ApiTags('supplier')
@Public()
@UseInterceptors(ClassSerializerInterceptor)
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) { }

  @Post('/')
  async createSupplier(@Body() body: CreateSupplierDto) {
    console.log("createdsds", body);

    return this.supplierService.create(body);
  }
  @Get()
  async findAllSuppliers(@Query() supplierQuery: QuerySupplierDto, @Query() pageOptionDto: PageOptionsDto): Promise<PageDto<SupplierDto>> {
    return await this.supplierService.find(supplierQuery, pageOptionDto);
  }
  @Put(':id')
  async updateSupplier(@Param('id') id: number, @Body() updateSupplierDto: UpdateSupplierDto) {
    return await this.supplierService.update(+id, updateSupplierDto);
  }

  @Delete(':id')
  removeSupplier(@Param('id') id: number) {
    return this.supplierService.remove(+id);
  }
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<SupplierDto> {
    let entity = await this.supplierService.findOne(id);
    return transformToDto(SupplierDto, entity) as SupplierDto;
  }

}
