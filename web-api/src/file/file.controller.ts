import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Patch,
  Param,
  Delete,
  NotFoundException,
  UseInterceptors,
  ClassSerializerInterceptor,
  Request,
  UnauthorizedException,
  Query,
  UploadedFile,
  ParseIntPipe,
  InternalServerErrorException,
  Res,
  BadRequestException,
} from '@nestjs/common';
import { FileService } from './file.service';
import { FileInterceptor } from '@nestjs/platform-express';
import * as AdmZip from 'adm-zip';
import { Express } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import * as unzipper from 'unzipper';
import * as extract from 'extract-zip';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/decorators/customize.decorator';
import { CreateFileDto } from './dtos/create-file.dto';
import { privateFileName } from 'src/utils/filename-private';
import { cutFilePath } from 'src/utils/cut-file-url';
import { UpdateFileDto } from './dtos/update-file.dto';
import { File } from './entities/file.entity';
import { PageOptionsDto } from 'src/utils/dtos/pageoptions-dto';
import { PageDto, ItemDto } from 'src/utils/dtos/page-dto';
import { ImageService } from 'src/image/image.service';
import { CreateImageDto } from 'src/image/dto/create-image.dto';
import { normalizeString } from 'src/utils/removeVietnamese';
@Controller('file')
@Public()
@ApiTags('file')
@UseInterceptors(ClassSerializerInterceptor)
export class FileController {
  constructor(private readonly fileService: FileService, private readonly imageService: ImageService) { }

  @Post('import-file')
  @UseInterceptors(FileInterceptor('file'))
  async importFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('grade_id', ParseIntPipe) grade_id: number
  ) {
    await this.fileService.importFile(file, grade_id);
    return {
      message: 'File uploaded and extracted successfully',
    };
  }


  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async create(@UploadedFile() file: Express.Multer.File, @Body() createFileDto: CreateFileDto) {
    try {
      let linkFile: string = '';
      let linkThumbnail: string = '';
      let images: Array<string> = []
      let isFolder = true
      // không phải thư mục
      if (file) {
        isFolder = false;
        const imagePath = path.join(__dirname, '..', '..', `/public/image/${privateFileName('image-thumbnail.png')}`);
        switch (file.mimetype) {
          case ('video/mp4'):
            const videoPath = path.join(__dirname, '..', '..', '/public/video', privateFileName(normalizeString(file.originalname)));
            fs.writeFileSync(videoPath, file.buffer);
            await this.fileService.generateImageFromVideo2(videoPath, imagePath, '00:00:14')
            linkFile = cutFilePath(videoPath, path.join(__dirname, '..', '..', '/public/'));
            linkThumbnail = cutFilePath(imagePath, path.join(__dirname, '..', '..', '/public/'))

            break;
          case ('application/pdf'):
            const pdfPath = path.join(__dirname, '..', '..', '/public/book', privateFileName(normalizeString(file.originalname)));
            fs.writeFileSync(pdfPath, file.buffer);
            await this.fileService.generateImageFromPdf(pdfPath, imagePath)
            const outputDir = path.join(__dirname, '../../public/images-convert');
            images = await this.fileService.convertPdfToImages(pdfPath, outputDir)
            linkFile = cutFilePath(pdfPath, path.join(__dirname, '..', '..', '/public/'));
            linkThumbnail = cutFilePath(imagePath, path.join(__dirname, '..', '..', '/public/'))
            break;
          case ('application/vnd.openxmlformats-officedocument.wordprocessingml.document'):
            const wordPath = path.join(__dirname, '..', '..', '/public/exam', privateFileName(normalizeString(file.originalname)));
            fs.writeFileSync(wordPath, file.buffer);
            linkFile = cutFilePath(wordPath, path.join(__dirname, '..', '..', '/public/'));
            linkThumbnail = 'image/image-word.png'
            break;
          default:
            const imageUrl = path.join(__dirname, '..', '..', '/public/image', privateFileName(normalizeString(file.originalname)));
            fs.writeFileSync(imageUrl, file.buffer);
            linkFile = cutFilePath(imageUrl, path.join(__dirname, '..', '..', '/public/'));
            const ourdir: string = path.join(__dirname, '..', '..', '/public/image', privateFileName(normalizeString('thumbnail-image.jpeg')));
            // Resize quantity image
            const link: string = await this.fileService.resizeImage(file.buffer, ourdir)
            linkThumbnail = cutFilePath(link, path.join(__dirname, '..', '..', '/public/'))
        }

      }
      const data: CreateFileDto = {
        name: createFileDto.name,
        filetype_id: +createFileDto.filetype_id,
        topic_id: +createFileDto.topic_id || null,
        parent_id: +createFileDto.parent_id,
        subject_id: +createFileDto.subject_id,
        previewImage: linkThumbnail,
        path: linkFile,
        isFolder,
        isGdGroup: +createFileDto.isGdGroup == 1 ? true : false,
      }
      const fileCreate = await this.fileService.create(data);
      if (images.length > 0) {
        for (let i = 0; i < images?.length; i++) {
          const imageDto: CreateImageDto = {
            name: createFileDto.name,
            fileId: fileCreate.id,
            path: images[i] || ''
          }
          await this.imageService.create(imageDto)
        }
      }
      return fileCreate
    } catch (error) {
      console.log(error);
    }
  }

  @Get()

  findAll(@Query() query: Partial<File>, @Query() pageOptionDto: PageOptionsDto): Promise<PageDto<File>> {
    return this.fileService.findAll(pageOptionDto, query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ItemDto<File>> {
    return await this.fileService.findOne(+id);
  }


  @Delete(':id')
  async removeGrade(@Param('id') id: number) {
    const file = await this.fileService.remove(+id)
    if (!file.isFolder) {
      const pathOld = path.join(__dirname, '..', '..', '/public', file?.path);
      const pathPrivew = path.join(__dirname, '..', '..', '/public', file?.previewImage);
      console.log(pathOld);
      console.log(pathPrivew);

      fs.unlinkSync(pathOld);
      if (fs.existsSync(pathPrivew)) {

        fs.unlinkSync(pathPrivew);
      }
      if (file.images.length > 0) {
        const images = file.images;
        for (let i = 0; i < images.length; i++) {

          const pathOldImage = path.join(__dirname, '..', '..', '/public', images[i].path);
          fs.unlinkSync(pathOldImage);

        }
      }
    }
    return file;
  }
}
