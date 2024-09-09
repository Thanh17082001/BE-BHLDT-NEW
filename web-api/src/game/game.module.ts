import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from './entities/game.entity';
import { GameQuestionModule } from 'src/game-question/game-question.module';

@Module({
  imports: [TypeOrmModule.forFeature([Game]), GameQuestionModule],
  controllers: [GameController],
  providers: [GameService],
})
export class GameModule {}
