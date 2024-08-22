import { TypeQuestionModule } from './../type-question/type-question.module';
import { Module } from '@nestjs/common';
import { LevelService } from './level.service';
import { LevelController } from './level.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Level } from './entities/level.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Level]), TypeQuestionModule],
  controllers: [LevelController],
  providers: [LevelService],
})
export class LevelModule {}
