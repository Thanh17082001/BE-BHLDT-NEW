import { Module } from '@nestjs/common';
import { TypeLibraryService } from './type-library.service';
import { TypeLibraryController } from './type-library.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeLibrary } from './entities/type-library.entity';

@Module({
  imports:[TypeOrmModule.forFeature([TypeLibrary])],
  controllers: [TypeLibraryController],
  providers: [TypeLibraryService],
  exports:[TypeOrmModule]
})
export class TypeLibraryModule {}
