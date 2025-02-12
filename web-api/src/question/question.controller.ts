import { LevelService } from './../level/level.service';
import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put, UseInterceptors, UploadedFile } from '@nestjs/common';
import { QuestionService } from './question.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Question } from './entities/question.entity';
import { PageOptionsDto } from 'src/utils/dtos/pageoptions-dto';
import { ItemDto, PageDto } from 'src/utils/dtos/page-dto';
import { RandomQuestionDto } from './dto/randoom-question.dto';
import * as XLSX from 'xlsx';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImportFileExcel } from './dto/excel-question.dto';
import { Level } from 'src/level/entities/level.entity';
import { Answer } from 'src/answer/entities/answer.entity';
import { CreateAnswerDto } from 'src/answer/dto/create-answer.dto';
import { clearScreenDown } from 'readline';
import { PartService } from 'src/part/part.service';

@Controller('question')
@ApiTags('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService,
    private readonly levelService: LevelService,
    private readonly partService: PartService,
  ) { }

  @Post()
  async create(@Body() createQuestionDto: CreateQuestionDto) {
    try {
      return this.questionService.create(createQuestionDto);
    } catch (error) {
      console.log(error);
    }
  }

  @Post('import-excel')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async importExcel(@UploadedFile() file: Express.Multer.File, @Body() importFileExcel: ImportFileExcel) {
    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);
    const keyData: string[] = Object.keys(data[0])
    const questions: Question[] = []
    const array = []
    console.log(data);
    let errors: Array<{ row: number, error: string }> = [];
    for (let i = 0; i < data.length; i++) {
      console.log(i);
      const item = data[i];
      console.log(item);
      try {
        const level = await this.levelService.findByName(item[keyData[2]]);
        const part = await this.partService.findByName(item['Phần']);
        const createQuestionDto: CreateQuestionDto = {
          content: item[keyData[1]],
          subjectId: +importFileExcel.subjectId,
          partId: part.id,
          topicId: +importFileExcel.topicId || null,
          typeQuestionId: +importFileExcel.typeQuestionId,
          numberOfAnswers: item['Phần']==='III'? 1 : 4,
          levelId: level.id,
          score: +0.25,
          answers: [{
            content: item['A'] ?? '',
            isCorrect: item['Đáp án đúng'] == 'A',
            questionId: 0
          }, {
            content: item['B'] ?? '',
            isCorrect: item['Đáp án đúng'] == 'B',
            questionId: 0
          }, {
            content: item['C'] ?? '',
            isCorrect: item['Đáp án đúng'] == 'C',
            questionId: 0
          }, {
            content: item['D'] ?? '',
            isCorrect: item['Đáp án đúng'] == 'D',
            questionId: 0
          },]
        };

        const result = await this.questionService.create(createQuestionDto);
        
        questions.push(result)
      } catch (error) {
        errors.push({ row: i + 1, error: error.message });
      }
    }
    return { questions, errors }
  }

  @Get()
  findAll(@Query() query: Partial<Question>, @Query() pageOptionDto: PageOptionsDto):Promise<PageDto<Question>> {
    return this.questionService.findAll(pageOptionDto,query);
  }

  @Post('/random')
  getRandomItems(@Body() randomqestTionDto: RandomQuestionDto): Promise<Array<Question>> {
    return this.questionService.getRandomItems(randomqestTionDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string):Promise<ItemDto<Question>> {
    return await this.questionService.findOne(+id);
  }


  @Put(':id')
  async update(@Param('id') id: string, @Body() updateQuestionDto: UpdateQuestionDto):Promise<Question> {
    return this.questionService.update(+id, updateQuestionDto);
  }

  

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.questionService.remove(+id);
  }
}

