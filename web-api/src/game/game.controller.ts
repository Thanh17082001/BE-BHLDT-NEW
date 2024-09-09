import { Game } from 'src/game/entities/game.entity';
import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put } from '@nestjs/common';
import { GameService } from './game.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { ApiTags } from '@nestjs/swagger';
import { PageOptionsDto } from 'src/utils/dtos/pageoptions-dto';
import { ItemDto, PageDto } from 'src/utils/dtos/page-dto';
import { AddQuestionToGameDto } from './dto/add-question.dto';

@Controller('game')
@ApiTags('game')
export class GameController {
  constructor(private readonly gameService: GameService) { }

  @Post()
  async create(@Body() createLevelDto: CreateGameDto): Promise<Game> {
    try {
      return this.gameService.create(createLevelDto);
    } catch (error) {
      console.log(error);
    }
  }

  @Post('add-question')
  async AddQuestionToGame(@Body() addQuestionToGameDto: AddQuestionToGameDto): Promise<Game> {
    try {
      return await this.gameService.addQuestionToGame(addQuestionToGameDto);
    } catch (error) {
      console.log(error,'tjajaajoaisdfkoasldkasda');
    }
  }


  @Get()
  findAll(@Query() query: Partial<CreateGameDto>, @Query() pageOptionDto: PageOptionsDto): Promise<PageDto<Game>> {
    return this.gameService.findAll(pageOptionDto, query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ItemDto<Game>> {
    return await this.gameService.findOne(+id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateTypeQuestionDto: UpdateGameDto): Promise<Game> {
    return this.gameService.update(+id, updateTypeQuestionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<Game> {
    return this.gameService.remove(+id);
  }
}

