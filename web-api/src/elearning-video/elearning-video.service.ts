


import {
  ForbiddenException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { GradeService } from 'src/grade/grade.service';

import { unlinkSync, existsSync } from 'fs';
import * as pathLib from 'path';

import { Question } from 'src/question/entities/question.entity';
import { PageOptionsDto } from 'src/utils/dtos/pageoptions-dto';
import { ItemDto, PageDto } from 'src/utils/dtos/page-dto';
import { PageMetaDto } from 'src/utils/dtos/pagemeta-dto';
import { ElearningVideo } from './entities/elearning-video.entity';
import { CreateElearningVideoDto } from './dto/create-elearning-video.dto';
import { UpdateElearningVideoDto } from './dto/update-elearning-video.dto';


@Injectable()
export class ElearningVideoService {
  constructor(
    @InjectRepository(ElearningVideo) private repo: Repository<ElearningVideo>,
  ) { }
  async create(
    createElearningVideoDto: CreateElearningVideoDto,
  ): Promise<ElearningVideo> {
    const { name, path,elearning_id,page, minetype } = createElearningVideoDto;


    const newElearningVideo = this.repo.create({
      name,
      path,
      elearning_id,
      page,
      minetype
    });
    return await this.repo.save(newElearningVideo);
  }

  async findAll(
    pageOptions: PageOptionsDto,
    query: Partial<ElearningVideo>,
  ): Promise<PageDto<ElearningVideo>> {
    const queryBuilder = this.repo
      .createQueryBuilder('ElearningVideo')
    
    const { page, take, skip, order, search } = pageOptions;
    const pagination: string[] = ['page', 'take', 'skip', 'order', 'search'];



    // 🎯 Lọc theo điều kiện tìm kiếm (bỏ qua các tham số phân trang)
    if (!!query && Object.keys(query).length > 0) {
      Object.keys(query).forEach((key) => {
        if (key && !pagination.includes(key)) {
          queryBuilder.andWhere(`ElearningVideo.${key} = :${key}`, {
            [key]: query[key],
          });
        }
      });
    }


    // 🎯 Tìm kiếm theo tên môn học (bỏ dấu)
    if (search) {
      queryBuilder.andWhere(
        `LOWER(unaccent("ElearningVideo".name)) ILIKE LOWER(unaccent(:search))`,
        {
          search: `%${search}%`,
        },
      );
    }

    // 🎯 Phân trang và sắp xếp
    queryBuilder.orderBy('ElearningVideo.createdAt', order).skip(skip).take(take);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    return new PageDto(
      entities,
      new PageMetaDto({ pageOptionsDto: pageOptions, itemCount }),
    );
  }

  async findOne(id: number): Promise<ItemDto<ElearningVideo>> {
    const example = await this.repo.findOne({ where: { id } });
    if (!example) {
      throw new HttpException('Not found', 404);
    }
    return new ItemDto(example);
  }

  async update(id: number, updateElearningVideoDto: UpdateElearningVideoDto) {
    const { name, path, elearning_id, page } = updateElearningVideoDto;


    const example: ElearningVideo = await this.repo.findOne({ where: { id }});

    if (!example) {
      throw new NotFoundException(`ElearningVideo with ID ${id} not found`);
    }

    this.repo.merge(example, { name, path, elearning_id, page });

    await this.repo.update(id, example);

    return new ItemDto(example);
  }

  async remove(path: string) {
    const result = await this.repo.delete({ path: path });
    if (result.affected === 0) {
      throw new NotFoundException('Không tìm thấy tài nguyên');
    }
    
    const filePath = pathLib.join(__dirname, '..', '..', 'public', path);

    // Kiểm tra và xóa file
    if (existsSync(filePath)) {
      try {
        unlinkSync(filePath); // Xoá đồng bộ
      } catch (err) {
        console.error('Lỗi khi xoá file:', err);
        // Tuỳ chọn: throw new InternalServerErrorException('Không thể xoá file vật lý');
      }
    }

    return new ItemDto({ message: 'Xóa thành công', affected: result.affected });
  }
}


//elearning-video\3c425477-f7eb-4921-bb73-7ec776561a6b_sa-ng-gia-icm-x-jack-official-music-video.mp4