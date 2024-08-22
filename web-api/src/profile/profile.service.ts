import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from './entities/profile.entity';
import { Not, Repository } from 'typeorm';
import { PageOptionsDto } from 'src/utils/dtos/pageoptions-dto';
import { PageDto } from 'src/utils/dtos/page-dto';
import { ProfileDto } from './dtos/profile.dto';
import { PageMetaDto } from 'src/utils/dtos/pagemeta-dto';
import { QueryProfileDto } from './dtos/query-profile.dto';
import { CreateProfileDto } from './dtos/create-profile.dto';
import { plainToInstance } from "class-transformer";
import { transformToDto } from "../utils/transformToDto";
import { difference } from 'src/utils/differeceArray';
import { Student } from 'src/student/entities/student.entity';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile) private repo: Repository<Profile>) {
  }

  async create(entity: CreateProfileDto) {
    const profileExist: Profile = await this.repo.findOne({ where: { code: entity.code } })
    if (profileExist) {
      throw new BadRequestException('Student code is already!');
    }
    const profile = this.repo.create(entity);
    const profileEntity = await this.repo.save(profile);
    return profileEntity;
  }

  async find(pageOptionsDto: PageOptionsDto, querys: Partial<Profile>): Promise<PageDto<Profile>> {
    const queryBuilder = this.repo.createQueryBuilder('profile');
    if (!!querys && Object.keys(querys).length > 0) {
      const arrayQuery = difference(Object.keys(pageOptionsDto), Object.keys(querys))
      arrayQuery.forEach((key) => {
        if (key !== undefined && key !== null) {
          queryBuilder.andWhere(`profile.${key} = :${key}`, { [key]: querys[key] });
          // queryBuilder.andWhere(`profile.filetype_id = :${4}`);
        }
      });
    }

    if (pageOptionsDto.search) {
      queryBuilder.andWhere('profile.name LIKE :name', { name: `%${pageOptionsDto.search}%` });
    }

    queryBuilder.orderBy("profile.createdAt", pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    const itemCount = await queryBuilder.getCount();
    const pageMetaDto = new PageMetaDto({ pageOptionsDto: pageOptionsDto, itemCount });
    const entities = await queryBuilder.getMany();

    return new PageDto(entities, pageMetaDto);
  }

  findOne(id: number) {
    return this.repo.findOne({
      where: {
        id: id
      }
    });
  }

  async update(id: number, attrs: Partial<Profile>) {
    const profile = await this.repo.findOne({
      where: {
        id: id,
      }
    });

    const exist = await this.repo.findOne({
      where: {
        id: Not(id),
        code: attrs.code
      }
    });
    if (!profile) {
      throw new NotFoundException('profile not found');
    }

    if (exist) {
      throw new BadRequestException('student code is already!');
    }

    Object.assign(profile, attrs);

    return this.repo.save(profile);
  }

  async remove(id: number) {
    const profile = await this.findOne(id);
    if (!profile) {
      throw new NotFoundException('profile not found');
    }
    return this.repo.remove(profile);
  }
}
