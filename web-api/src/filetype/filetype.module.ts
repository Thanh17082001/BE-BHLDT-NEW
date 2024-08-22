import { Module } from '@nestjs/common';
import { FileTypeService } from './filetype.service';
import { FileTypeController } from './filetype.controller';
import { FileType } from './entities/filetype.entity';

import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports: [TypeOrmModule.forFeature([FileType])],
  controllers: [FileTypeController],
  providers: [FileTypeService],
  exports: [FileTypeService],
})
export class FileTypeModule { }
