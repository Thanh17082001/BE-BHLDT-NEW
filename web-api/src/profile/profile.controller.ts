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
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dtos/create-profile.dto';
import { UpdateProfileDto } from './dtos/update-profile.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { ProfileDto } from './dtos/profile.dto';
import { QueryProfileDto } from './dtos/query-profile.dto';
import { PageOptionsDto } from 'src/utils/dtos/pageoptions-dto';
import { PageDto } from 'src/utils/dtos/page-dto';
import { transformToDto } from 'src/utils/transformToDto';
import { ApiTags } from '@nestjs/swagger';
import { Profile } from './entities/profile.entity';

@Controller('profile')
  @ApiTags('profile')
@UseInterceptors(ClassSerializerInterceptor)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) { }

  @Post('/')
  async createProfile(@Body() body: CreateProfileDto) {

    return this.profileService.create(body);
  }
  @Get()
  findAll(@Query() query: Partial<Profile>, @Query() pageOptionDto: PageOptionsDto):Promise<PageDto<Profile>> {
    return this.profileService.find(pageOptionDto,query);
  }
  @Put(':id')
  async updateProfile(@Param('id') id: number, @Body() updateProfileDto: UpdateProfileDto) {
    return await this.profileService.update(+id, updateProfileDto);
  }

  @Delete(':id')
  removeProfile(@Param('id') id: number) {
    return this.profileService.remove(+id);
  }
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<ProfileDto> {
    let entity = await this.profileService.findOne(id);
    return transformToDto(ProfileDto, entity) as ProfileDto;
  }

}
