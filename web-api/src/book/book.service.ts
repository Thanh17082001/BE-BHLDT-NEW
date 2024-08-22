import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { Repository } from 'typeorm';
import { BookInterface } from './interface/book.interface';
import { PageOptionsDto } from 'src/utils/dtos/pageoptions-dto';
import { PageDto } from 'src/utils/dtos/page-dto';
import { difference } from 'src/utils/differeceArray';
import { PageMetaDto } from 'src/utils/dtos/pagemeta-dto';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book) private repo: Repository<Book>) {
  }
  async create(CreateBookDto: CreateBookDto) :Promise<BookInterface> {
    return await this.repo.save(CreateBookDto);
  }

  async findAll(pageOptions : PageOptionsDto, queryBook: Partial<BookInterface>): Promise<PageDto<BookInterface>> {
    const queryBuilder = this.repo.createQueryBuilder('book')
    if (!!queryBook && Object.keys(queryBook).length > 0) {
      const arrayQuery = difference(Object.keys(pageOptions), Object.keys(queryBook))
      console.log(arrayQuery);
     arrayQuery.forEach((key) => {
        if (key !== undefined && key !== null ) {
          queryBuilder.andWhere(`book.${key} = :${key}`, { [key]: queryBook[key] });
        }
      });
    }

    queryBuilder.orderBy("book.createdAt", pageOptions.order)
    .skip(pageOptions.skip)
      .take(pageOptions.take);
      
      const itemCount = await queryBuilder.getCount();
      const pageMetaDto = new PageMetaDto({pageOptionsDto:pageOptions, itemCount });
    const { entities } = await queryBuilder.getRawAndEntities();

    return new PageDto(entities, pageMetaDto);
    
  }
  

  async findOne(id: number): Promise<BookInterface> {
    return this.repo.findOne({
      where: {
        id:id
      }
    })
  }

  async update(id: number, updateBookDto: Partial<UpdateBookDto>): Promise<BookInterface> {
    const typeLib: BookInterface = await this.findOne(id);
    if (!typeLib) {
      throw new NotFoundException('user not found');
    }
     const data = this.repo.merge(
      typeLib,
      updateBookDto,
    );
    return await this.repo.save(data);
  }

}