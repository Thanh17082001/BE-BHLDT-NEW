import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { GameQuestionService } from './game-question.service';
import { CreateGameQuestionDto } from './dto/create-game-question.dto';
import { UpdateGameQuestionDto } from './dto/update-game-question.dto';
import { PageOptionsDto } from 'src/utils/dtos/pageoptions-dto';
import { GameQuestion } from './entities/game-question.entity';
import { PageDto } from 'src/utils/dtos/page-dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('game-question')
@ApiTags('game-question')
export class GameQuestionController {
  constructor(private readonly gameQuestionService: GameQuestionService) {}

  @Post()
  create(@Body() createGameQuestionDto: CreateGameQuestionDto) {
    return this.gameQuestionService.create(createGameQuestionDto);
  }

  @Get()
  findAll(@Query() query: Partial<CreateGameQuestionDto>, @Query() pageOptionDto: PageOptionsDto): Promise<PageDto<GameQuestion>> {
    return this.gameQuestionService.findAll(pageOptionDto, query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gameQuestionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGameQuestionDto: UpdateGameQuestionDto) {
    return this.gameQuestionService.update(+id, updateGameQuestionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gameQuestionService.remove(+id);
  }
}
