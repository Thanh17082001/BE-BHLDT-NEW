import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Game } from './entities/game.entity';
import { Not, Repository } from 'typeorm';
import { PageOptionsDto } from 'src/utils/dtos/pageoptions-dto';
import { difference } from 'src/utils/differeceArray';
import { ItemDto, PageDto } from 'src/utils/dtos/page-dto';
import { PageMetaDto } from 'src/utils/dtos/pagemeta-dto';
import { GameQuestion } from 'src/game-question/entities/game-question.entity';
import { AddQuestionToGameDto } from './dto/add-question.dto';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(Game) private repo: Repository<Game>,
    @InjectRepository(GameQuestion)
    private questionRepository: Repository<GameQuestion>,
  ) {
  }
  async create(createGameDto: CreateGameDto): Promise<Game> {
    const exits = await this.repo.findOne({
      where: {
        name: createGameDto.name,
      }
    })

    return await this.repo.save(createGameDto);
  }

  async addQuestionToGame(addQuestionToGame: AddQuestionToGameDto): Promise<Game> {
   try {
     // Tìm game theo id
     const game = await this.repo.findOne({
       where: { id: +addQuestionToGame.gameId },
       relations: ['questions'],
     });
     if (!game) {
       throw new NotFoundException('Game not found');
     }

     if (!game?.questions) {
       game.questions = [];
     }


     // thêm câu có sẵn vào
     if (addQuestionToGame.gameQuestionIds?.length > 0) {
       game.questions = [];
       for (let i = 0; i < addQuestionToGame?.gameQuestionIds?.length; i++) {
         const idQuestion = addQuestionToGame.gameQuestionIds[i];
         const question: GameQuestion = await this.questionRepository.findOne({
           where: { id: +idQuestion },
         });

         game.questions.push(question);

       }

     }
     // Thêm mới câu hỏi và push vào mảng trong game
     else {
       const question: GameQuestion = await this.questionRepository.save({
         suggest: addQuestionToGame.gameQuestion.suggest,
         answer: addQuestionToGame.gameQuestion.answer,
       })



       const checkQuestionExist = game.questions.some((item) => item.id === question.id)
       if (checkQuestionExist) {
         throw new BadRequestException('Question already exists');
       }
       game.questions.push(question)

     }
     const result = await this.repo.save(game);
    
     return result
   } catch (error) {
    console.log(error,'lôiiiiiiiiii');
   }
  }


  async findAll(pageOptions: PageOptionsDto, query: Partial<Game>): Promise<PageDto<Game>> {
    const queryBuilder = this.repo.createQueryBuilder('game').where('game.status = :status', { status: 1 }).leftJoinAndSelect('game.questions', 'gameQuestion');
    if (!!query && Object.keys(query).length > 0) {
      const arrayQuery = difference(Object.keys(pageOptions), Object.keys(query))
      arrayQuery.forEach((key) => {
        if (key !== undefined && key !== null && key != 'page' && key != 'take' && key != 'skip' && key != 'order') {
          queryBuilder.andWhere(`game.${key} = :${key}`, { [key]: query[key] });
        }
      });
    }

    if (pageOptions.search) {
      queryBuilder.andWhere('game.name LIKE :name', { name: `%${pageOptions.search}%` });
    }

    queryBuilder.orderBy("game.createdAt", pageOptions.order)
      .skip(pageOptions.skip)
      .take(pageOptions.take);

    const itemCount = await queryBuilder.getCount();
    const pageMetaDto = new PageMetaDto({ pageOptionsDto: pageOptions, itemCount });
    const entities = await queryBuilder.getMany();

    return new PageDto(entities, pageMetaDto);

  }


  async findOne(id: number): Promise<ItemDto<Game>> {
    return new ItemDto(await this.repo.findOne({
      where: {
        id: id
      },
      relations: ['questions']
    }))
  }

  async update(id: number, updateTypeScore: Partial<UpdateGameDto>): Promise<Game> {
    const typeQuestion: Game = await this.repo.findOne({
      where: {
        id: id
      }
    });
    const exits = await this.repo.findOne({
      where: {
        name: updateTypeScore.name,
        id: Not(id),
        status: 1
      }
    })
    if (exits) {
      throw new BadRequestException('game  is already!')
    }
    if (!typeQuestion) {
      throw new NotFoundException('game does not exits!');
    }
    const data = this.repo.merge(
      typeQuestion,
      updateTypeScore,
    );
    return await this.repo.save(data);
  }

  async remove(id: number): Promise<Game> {
    const typeQuestion: Game = await this.repo.findOne({
      where: {
        id: id
      }
    });
    if (!typeQuestion) {
      throw new NotFoundException('Game does not exits!');
    }
    return await this.repo.remove(typeQuestion)
  }

}

