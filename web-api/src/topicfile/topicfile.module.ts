import { Module } from '@nestjs/common';
import { TopicFileService } from './topicfile.service';
import { TopicFileController } from './topicfile.controller';
import { TopicFile } from './entities/topicfile.entity';

import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports: [TypeOrmModule.forFeature([TopicFile])],
  controllers: [TopicFileController],
  providers: [TopicFileService],
  exports: [TopicFileService],
})
export class TopicFileModule { }
