import { Module } from '@nestjs/common';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Book])],
  controllers: [BookController],
  providers: [BookService],
    exports: [TypeOrmModule],
})
export class BookModule {}
