import { Module } from '@nestjs/common';
import { GameQuestionService } from './game-question.service';
import { GameQuestionController } from './game-question.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameQuestion } from './entities/game-question.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GameQuestion])],
  controllers: [GameQuestionController],
  providers: [GameQuestionService],
  exports: [TypeOrmModule],
})
export class GameQuestionModule {}
