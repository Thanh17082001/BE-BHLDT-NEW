import { CreateElearningThemeDto } from './dto/create-elearning-theme.dto';
import { UpdateElearningThemeDto } from './dto/update-elearning-theme.dto';




import {
  ForbiddenException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { GradeService } from 'src/grade/grade.service';

import { Question } from 'src/question/entities/question.entity';
import { PageOptionsDto } from 'src/utils/dtos/pageoptions-dto';
import { ItemDto, PageDto } from 'src/utils/dtos/page-dto';
import { PageMetaDto } from 'src/utils/dtos/pagemeta-dto';
import { ElearningTheme } from './entities/elearning-theme.entity';


@Injectable()
export class ElearningThemeService {
  constructor(
    @InjectRepository(ElearningTheme) private repo: Repository<ElearningTheme>,
  ) { }
  async create(
    createElearningThemeDto: CreateElearningThemeDto,
  ): Promise<ElearningTheme> {
    const { title,content,path,} = createElearningThemeDto;


    const newElearningTheme = this.repo.create({
      title,
      content,
      path,
    });
    return await this.repo.save(newElearningTheme);
  }

  async findAll(
    pageOptions: PageOptionsDto,
    query: Partial<ElearningTheme>,
  ): Promise<PageDto<ElearningTheme>> {
    const queryBuilder = this.repo
      .createQueryBuilder('ElearningTheme')
    
    const { page, take, skip, order, search } = pageOptions;
    const pagination: string[] = ['page', 'take', 'skip', 'order', 'search'];



    // 🎯 Lọc theo điều kiện tìm kiếm (bỏ qua các tham số phân trang)
    if (!!query && Object.keys(query).length > 0) {
      Object.keys(query).forEach((key) => {
        if (key && !pagination.includes(key)) {
          queryBuilder.andWhere(`ElearningTheme.${key} = :${key}`, {
            [key]: query[key],
          });
        }
      });
    }


    // 🎯 Tìm kiếm theo tên môn học (bỏ dấu)
    if (search) {
      queryBuilder.andWhere(
        `LOWER(unaccent("ElearningTheme".name)) ILIKE LOWER(unaccent(:search))`,
        {
          search: `%${search}%`,
        },
      );
    }

    // 🎯 Phân trang và sắp xếp
    queryBuilder.orderBy('ElearningTheme.createdAt', order).skip(skip).take(take);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    return new PageDto(
      entities,
      new PageMetaDto({ pageOptionsDto: pageOptions, itemCount }),
    );
  }

  async findOne(id: number): Promise<ItemDto<ElearningTheme>> {
    const example = await this.repo.findOne({ where: { id } });
    if (!example) {
      throw new HttpException('Not found', 404);
    }
    return new ItemDto(example);
  }

  async update(id: number, updateElearningThemeDto: UpdateElearningThemeDto) {
    const {title,content } = updateElearningThemeDto;


    const example: ElearningTheme = await this.repo.findOne({ where: { id }});

    if (!example) {
      throw new NotFoundException(`ElearningTheme with ID ${id} not found`);
    }

    this.repo.merge(example, {title,content });

    await this.repo.update(id, example);

    return new ItemDto(example);
  }

  async remove(id: number) {
    const example: ElearningTheme = await this.repo.findOne({
      where: { id },
      relations: ['createdBy', 'school'],
    });

    if (!example) {
      throw new NotFoundException('Không tìm thấy tài nguyên');
    }

    await this.repo.delete(id);
    return new ItemDto(await this.repo.delete(id));
  }
}
