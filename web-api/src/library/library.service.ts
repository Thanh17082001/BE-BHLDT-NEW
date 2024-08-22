import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateLibraryDto } from './dto/create-library.dto';
import { UpdateLibraryDto } from './dto/update-library.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Library } from './entities/library.entity';
import { Repository } from 'typeorm';
import { Subject } from 'src/subject/entities/subject.entity';
import { Grade } from 'src/grade/entities/grade.entity';
import { Book } from 'src/book/entities/book.entity';
import { Topic } from 'src/topic/entities/topic.entity';
import { TypeLibrary } from 'src/type-library/entities/type-library.entity';
import { LibraryInterface } from './interface/library.interface';
import { PageOptionsDto } from 'src/utils/dtos/pageoptions-dto';
import { PageDto } from 'src/utils/dtos/page-dto';
import { difference } from 'src/utils/differeceArray';
import { PageMetaDto } from 'src/utils/dtos/pagemeta-dto';

@Injectable()
export class LibraryService {
  constructor(
    @InjectRepository(Library) private repo: Repository<Library>,
    @InjectRepository(Subject) private readonly subjectRepo: Repository<Subject>,
    @InjectRepository(Grade) private readonly gradeRepo: Repository<Grade>,
    @InjectRepository(Book) private readonly bookRepo: Repository<Book>,
    @InjectRepository(Topic) private readonly topicRepo: Repository<Topic>,
    @InjectRepository(TypeLibrary) private readonly typeRepo: Repository<Topic>,
  ) {}
  async create(createLibraryDto: Partial<CreateLibraryDto>): Promise<LibraryInterface> {
    const { name, size, path,linkImage, subjectId, gradeId, bookId,topicId, typeId } = createLibraryDto;
    const subject: Subject = await this.subjectRepo.findOne({ where: { id: +subjectId } })
    const grade: Grade = await this.gradeRepo.findOne({ where: { id: +gradeId } })
    const book: Book = await this.bookRepo.findOne({ where: { id: +bookId } })
    const topic: Topic = await this.topicRepo.findOne({ where: { id: +topicId } })
    const type: TypeLibrary = await this.typeRepo.findOne({ where: { id: +typeId } })
    // if (!subject) {
    //   throw new BadRequestException('subject is not empty or subject not found')
    // }
    //  if (!grade) {
    //   throw new BadRequestException('grade is not empty or grade not found')
    // }
    //  if (!book) {
    //   throw new BadRequestException('book is not empty or book not found')
    // }
    //  if (!topic) {
    //   throw new BadRequestException('topic is not empty or topic not found')
    // }
    //  if (!typeId) {
    //   throw new BadRequestException('type library is not empty or type library not found')
    // }
    const data = {
      name, size, path, linkImage,
      subject,grade,book,topic,type
    }
    return await this.repo.save(data);
  }

  async findAll(pageOptions : PageOptionsDto, queryPosition: Partial<LibraryInterface>): Promise<PageDto<LibraryInterface>> {
    const queryBuilder = this.repo.createQueryBuilder('library')
      .leftJoinAndSelect('library.subject', 'subject')
      .leftJoinAndSelect('library.book', 'book')
      .leftJoinAndSelect('library.grade', 'grade')
      .leftJoinAndSelect('library.topic', 'topic')
      .leftJoinAndSelect('library.type', 'type')
      .where('library.status = :status', { status: 1 });
    if (!!queryPosition && Object.keys(queryPosition).length > 0) {
      const arrayQuery = difference(Object.keys(pageOptions), Object.keys(queryPosition))
     arrayQuery.forEach((key) => {
        if (key !== undefined && key !== null ) {
          queryBuilder.andWhere(`library.${key} = :${key}`, { [key]: queryPosition[key] });
        }
      });
    }

    queryBuilder.orderBy("library.createdAt", pageOptions.order)
    .skip(pageOptions.skip)
      .take(pageOptions.take);
      
      const itemCount = await queryBuilder.getCount();
      const pageMetaDto = new PageMetaDto({pageOptionsDto:pageOptions, itemCount });
    const  entities  = await queryBuilder.getMany();

    return new PageDto(entities, pageMetaDto);
    
  }
  

  async findOne(id: number): Promise<LibraryInterface> {
    return this.repo.findOne({
      where: {
        id:id
      },
      relations: ['subject','grade','book', 'topic','type'],
    })
  }

  async update(id: number, updateLibraryDto: Partial<UpdateLibraryDto>): Promise<LibraryInterface> {
    const library: LibraryInterface = await this.findOne(id);
     const subject: Subject = await this.subjectRepo.findOne({ where: { id: +updateLibraryDto.subjectId } })
    const grade: Grade = await this.gradeRepo.findOne({ where: { id: +updateLibraryDto.gradeId } })
    const book: Book = await this.bookRepo.findOne({ where: { id: +updateLibraryDto.bookId } })
    const topic: Topic = await this.topicRepo.findOne({ where: { id: +updateLibraryDto.topicId } })
    const type: TypeLibrary = await this.typeRepo.findOne({ where: { id: +updateLibraryDto.typeId } })

    if (!!subject) {
       library.subject = subject;
    }
     if (!!grade) {
          library.grade = grade;
    }
     if (!!book) {
     library.book = book;
    }
     if (!!topic) {
      library.topic = topic;
    }
     if (!!type) {
      library.type = type;
    }

    if (!library) {
      throw new NotFoundException('user not found');
    }
     const data = this.repo.merge(
      library,
      updateLibraryDto,
    );
    return await this.repo.save(data);
  }
  async remove(id: number):Promise<LibraryInterface> {
    const library: LibraryInterface = await this.findOne(id);
    if (!library) {
      throw new NotFoundException('library does not exits!');
    }
     const data = this.repo.merge(
      library,
      {status:0},
    );
    return await this.repo.save(data);
  }
}
