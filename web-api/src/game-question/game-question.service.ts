import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateGameQuestionDto } from './dto/create-game-question.dto';
import { UpdateGameQuestionDto } from './dto/update-game-question.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { GameQuestion } from './entities/game-question.entity';
import { Not, Repository } from 'typeorm';
import { PageOptionsDto } from 'src/utils/dtos/pageoptions-dto';
import { ItemDto, PageDto } from 'src/utils/dtos/page-dto';
import { difference } from 'src/utils/differeceArray';
import { PageMetaDto } from 'src/utils/dtos/pagemeta-dto';

@Injectable()
export class GameQuestionService {
  constructor(
    @InjectRepository(GameQuestion)
    private repo: Repository<GameQuestion>,
  ) { }

  async create(createGameQuestionDto: CreateGameQuestionDto): Promise<GameQuestion> {
    const exits = await this.repo.findOne({
      where: {
        suggest: createGameQuestionDto.suggest,
      }
    })

    return await this.repo.save(createGameQuestionDto);
  }

  async findAll(pageOptions: PageOptionsDto, query: Partial<GameQuestion>): Promise<PageDto<GameQuestion>> {
    const pagination = ['page', 'take', 'skip', 'order']
    const queryBuilder = this.repo.createQueryBuilder('game-question')
                                  .where('game-question.status = :status', { status: 1 })
                                  .leftJoinAndSelect('game-question.games', 'games');
    if (!!query && Object.keys(query).length > 0) {
      const arrayQuery = difference(Object.keys(pageOptions), Object.keys(query))
      arrayQuery.forEach((key) => {
        if (key !== undefined && key !== null && !pagination.includes(key)) {
          queryBuilder.andWhere(`game-question.${key} = :${key}`, { [key]: query[key] });
        }
      });
    }

    if (pageOptions.search) {
      queryBuilder.andWhere('game-question.name LIKE :name', { name: `%${pageOptions.search}%` });
    }

    queryBuilder.orderBy("game-question.createdAt", pageOptions.order)
      .skip(pageOptions.skip)
      .take(pageOptions.take);

    const itemCount = await queryBuilder.getCount();
    const pageMetaDto = new PageMetaDto({ pageOptionsDto: pageOptions, itemCount });
    const entities = await queryBuilder.getMany();

    return new PageDto(entities, pageMetaDto);

  }

  async findOne(id: number): Promise<ItemDto<GameQuestion>> {
    return new ItemDto(await this.repo.findOne({
      where: {
        id: id
      },
      relations:['games']
    }))
  }

  async update(id: number, updateTypeScore: Partial<UpdateGameQuestionDto>): Promise<GameQuestion> {
    const gameQuestion: GameQuestion = await this.repo.findOne({
      where: {
        id: id
      }
    });
    const exits = await this.repo.findOne({
      where: {
        suggest: updateTypeScore.suggest,
        id: Not(id),
        status: 1
      }
    })
    if (exits) {
      throw new BadRequestException('game question  is already!')
    }
    if (!gameQuestion) {
      throw new NotFoundException('game question does not exits!');
    }
    const data = this.repo.merge(
      gameQuestion,
      updateTypeScore,
    );
    return await this.repo.save(data);
  }

  async remove(id: number): Promise<GameQuestion> {
    const typeQuestion: GameQuestion = await this.repo.findOne({
      where: {
        id: id
      }
    });
    if (!typeQuestion) {
      throw new NotFoundException('Game question does not exits!');
    }
    return await this.repo.remove(typeQuestion)
  }
}
