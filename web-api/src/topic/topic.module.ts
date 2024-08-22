import { Module } from '@nestjs/common';
import { TopicService } from './topic.service';
import { TopicController } from './topic.controller';
import { Topic } from './entities/topic.entity';

import { TypeOrmModule } from '@nestjs/typeorm';
import { SubjectModule } from 'src/subject/subject.module';
@Module({
  imports: [TypeOrmModule.forFeature([Topic]), SubjectModule],
  controllers: [TopicController],
  providers: [TopicService],
  exports: [TopicService, TypeOrmModule],
})
export class TopicModule { }
