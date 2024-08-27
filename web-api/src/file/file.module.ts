import { forwardRef, Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';

import { TypeOrmModule } from '@nestjs/typeorm';
import { File } from './entities/file.entity';
import { TopicService } from 'src/topic/topic.service';
import { TopicModule } from 'src/topic/topic.module';
import { SubjectModule } from 'src/subject/subject.module';
import { FileTypeModule } from 'src/filetype/filetype.module';
import { ImageModule } from 'src/image/image.module';
import { VoiceModule } from 'src/voice/voice.module';
@Module({
  imports: [TypeOrmModule.forFeature([File]), TopicModule,forwardRef(() => SubjectModule),FileTypeModule, forwardRef(() => ImageModule),VoiceModule],
  controllers: [FileController],
  providers: [FileService],
  exports: [FileService, TypeOrmModule],
})
export class FileModule { }
