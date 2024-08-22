import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Query, Res, BadRequestException } from '@nestjs/common';
import { CovertFileService } from './covert-file.service';
import { CreateCovertFileDocxDto } from './dto/create-covert-file.dto';
import { CreateCovertFileRtfDto } from './dto/update-covert-file.dto';
import { ApiConsumes, ApiQuery, ApiTags } from '@nestjs/swagger';
import * as fs from 'fs';
import * as path from 'path';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { v4 as uuidv4 } from 'uuid';
import { CLIENT_RENEG_LIMIT } from 'tls';
import { query } from 'express';
import { Response } from "express";

@Controller('covert-file')
@ApiTags('covert-file')
export class CovertFileController {
  constructor(private readonly covertFileService: CovertFileService) {}

  @Post('/docx-to-rtf')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async createDocx(@UploadedFile() file: Express.Multer.File, @Body() createCovertFileDto: CreateCovertFileDocxDto) {
    const fileExt = path.extname(file.originalname).toLowerCase();
    if (fileExt !== '.docx') {
      throw new BadRequestException('The file is not in the correct format')
    }
    const nameFile = `${uuidv4()}_${file.originalname}`
    const inputFilePath = path.join(__dirname, '..', '..', '/public/word', nameFile);
            fs.writeFileSync(inputFilePath, file.buffer);
    
    const outputFilePath = path.join(__dirname,'..', '..','/public/rtf');

    return await this.covertFileService.convertDocxToRtfByLibreOffice(inputFilePath, outputFilePath);
    
  }

  @Post('/rtf-to-docx')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async createRtf(@UploadedFile() file: Express.Multer.File, @Body() createCovertFileDto: CreateCovertFileRtfDto) {
    const fileExt = path.extname(file.originalname).toLowerCase();
    if (fileExt !== '.rtf') {
      throw new BadRequestException('The file is not in the correct format')
    }
    const nameFile = `${uuidv4()}_${file.originalname}`
    const inputFilePath = path.join(__dirname, '..', '..', '/public/rtf', nameFile);
            fs.writeFileSync(inputFilePath, file.buffer);
    
    const outputFilePath = path.join(__dirname, '..', '..', '/public/word');

    return await this.covertFileService.convertRtfToDocx(inputFilePath, outputFilePath);
    
  }

  @Get('/covert-to-base64')
  @ApiQuery({
    name: "fileName",
    type:'String'
  })
  readFileAsBase64(@Query() query: any, @Res() res: Response): any {
      const absolutePath = path.join(__dirname, '..','..', 'public', 'rtf',  query.fileName);
    const fileBuffer = fs.readFileSync(absolutePath);
     const fileStream =  fs.createReadStream(absolutePath)
    return fileBuffer;
  }

}
