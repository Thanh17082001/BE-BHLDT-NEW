import { CreateElearningDto } from './dto/create-elearning.dto';
import { UpdateElearningDto } from './dto/update-elearning.dto';



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
import { Elearning } from './entities/elearning.entity';
import { PageOptionsDto } from 'src/utils/dtos/pageoptions-dto';
import { ItemDto, PageDto } from 'src/utils/dtos/page-dto';
import { PageMetaDto } from 'src/utils/dtos/pagemeta-dto';

@Injectable()
export class ElearningService {
  constructor(
    @InjectRepository(Elearning) private repo: Repository<Elearning>,
  ) { }
  async create(
    createElearningDto: CreateElearningDto,
  ): Promise<Elearning> {
    const { content, title,subjectId,topic } = createElearningDto;

    

    const newElearning = this.repo.create({
      content,
      title,
      subjectId,
      topic,
    });
    return await this.repo.save(newElearning);
  }

  async findAll(
    pageOptions: PageOptionsDto,
    query: Partial<Elearning>,
  ): Promise<PageDto<Elearning>> {
    const queryBuilder = this.repo
      .createQueryBuilder('Elearning')
    
    const { page, take, skip, order, search } = pageOptions;
    const pagination: string[] = ['page', 'take', 'skip', 'order', 'search'];



    // 🎯 Lọc theo điều kiện tìm kiếm (bỏ qua các tham số phân trang)
    if (!!query && Object.keys(query).length > 0) {
      Object.keys(query).forEach((key) => {
        if (key && !pagination.includes(key)) {
          queryBuilder.andWhere(`Elearning.${key} = :${key}`, {
            [key]: query[key],
          });
        }
      });
    }


    // 🎯 Tìm kiếm theo tên môn học (bỏ dấu)
    if (search) {
      queryBuilder.andWhere(
        `LOWER(unaccent("Elearning".name)) ILIKE LOWER(unaccent(:search))`,
        {
          search: `%${search}%`,
        },
      );
    }

    // 🎯 Phân trang và sắp xếp
    queryBuilder.orderBy('Elearning.createdAt', order).skip(skip).take(take);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    return new PageDto(
      entities,
      new PageMetaDto({ pageOptionsDto: pageOptions, itemCount }),
    );
  }

  async findOne(id: number): Promise<ItemDto<Elearning>> {
    const example = await this.repo.findOne({ where: { id } });
    if (!example) {
      throw new HttpException('Not found', 404);
    }
    return new ItemDto(example);
  }

  async update(id: number, updateElearningDto: UpdateElearningDto) {
    const { content, title,subjectId,topic } = updateElearningDto;


    const example: Elearning = await this.repo.findOne({ where: { id }});

    if (!example) {
      throw new NotFoundException(`Elearning with ID ${id} not found`);
    }

    this.repo.merge(example, { content, title, subjectId,topic });

    await this.repo.update(id, example);

    return new ItemDto(example);
  }

  async remove(id: number) {
    const example: Elearning = await this.repo.findOne({
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
