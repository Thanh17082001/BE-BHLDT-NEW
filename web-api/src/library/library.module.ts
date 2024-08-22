import { Module } from '@nestjs/common';
import { LibraryService } from './library.service';
import { LibraryController } from './library.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Library } from './entities/library.entity';
import { SubjectModule } from 'src/subject/subject.module';
import { GradeModule } from 'src/grade/grade.module';
import { BookModule } from 'src/book/book.module';
import { TopicModule } from 'src/topic/topic.module';
import { TypeLibraryModule } from 'src/type-library/type-library.module';

@Module({
  imports: [TypeOrmModule.forFeature([Library]), SubjectModule, GradeModule, BookModule, TopicModule, TypeLibraryModule],
  controllers: [LibraryController],
  providers: [LibraryService],
})
export class LibraryModule {}
