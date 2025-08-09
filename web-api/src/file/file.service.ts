import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { File } from './entities/file.entity';
import { Repository } from 'typeorm';
import { PageOptionsDto } from 'src/utils/dtos/pageoptions-dto';
import { ItemDto, PageDto } from 'src/utils/dtos/page-dto';
import { FileDto } from './dtos/file.dto';
import { PageMetaDto } from 'src/utils/dtos/pagemeta-dto';
import { QueryFileDto } from './dtos/query-file.dto';
import { CreateFileDto } from './dtos/create-file.dto';
import { plainToInstance } from "class-transformer";
import { transformToDto } from "../utils/transformToDto";
import * as AdmZip from 'adm-zip';
import { Express } from 'express';
import * as path from 'path';
import * as unzipper from 'unzipper';
import * as extract from 'extract-zip';
import { TopicService } from 'src/topic/topic.service';
import { SubjectService } from 'src/subject/subject.service';
import { FileTypeService } from 'src/filetype/filetype.service';
import { Subject } from 'src/subject/entities/subject.entity';
import { Grade } from 'src/grade/entities/grade.entity';
import { Topic } from 'src/topic/entities/topic.entity';
import * as ffmpeg from 'fluent-ffmpeg';
import * as pdf from 'pdf-thumbnail';
import * as pdfThumbnail from 'pdf-thumbnail';
import { PDFDocument, PDFPage, rgb } from 'pdf-lib';
import * as sharp from 'sharp';
import { fromPath } from 'pdf2pic';
import * as gm from 'gm';
import { pdfToPng, PngPageOutput } from 'pdf-to-png-converter';
import { promises as fs } from 'fs';
import { difference } from 'src/utils/differeceArray';
import * as pdfPoppler from 'pdf-poppler';
import { TypeVoice } from 'src/type-voice/entities/type-voice.entity';
import { Voice } from 'src/voice/entities/voice.entity';


@Injectable()
export class FileService {
  constructor(
    @InjectRepository(File) private repo: Repository<File>, private topicService: TopicService,
    @InjectRepository(Voice) private repoVoice: Repository<Voice>,

    private subjectService: SubjectService, private fileType: FileTypeService) {
    ffmpeg.setFfmpegPath(require("@ffmpeg-installer/ffmpeg").path);
  }
  async create(entity: CreateFileDto) {

    const fileType = this.repo.create(entity);
    const fileTypeEntity = await this.repo.save(fileType);
    return fileTypeEntity;
  }
  async generateImageFromPdf(inputImagePath: string, outputThumbnailPath: string): Promise<void> {
    try {
      const pngPages: PngPageOutput[] = await pdfToPng(inputImagePath, {
        outputFolder: path.dirname(outputThumbnailPath),
        outputFileMask: path.basename(outputThumbnailPath, path.extname(outputThumbnailPath)),
        viewportScale: 2.0,
        pagesToProcess: [1], // Process only the first page for thumbnail
      });

      const pngPagePath = pngPages[0].path;

      if (pngPagePath) {
        const newPngPagePath = path.join(path.dirname(pngPagePath), 'thumbnail.png');

        // Di chuyển hoặc đổi tên tệp PNG
        await fs.rename(pngPagePath, newPngPagePath);
        //  const jpgOutputPath = path.join(path.dirname(outputThumbnailPath), `${path.basename(outputThumbnailPath, path.extname(outputThumbnailPath))}.jpg`);
        const jpgOutputPath = path.join(path.dirname(outputThumbnailPath), '1.png');
        await sharp(newPngPagePath)
          .jpeg({ quality: 80 }) // Adjust the quality parameter as needed
          .toFile(jpgOutputPath)
        const newJpgPagePath = path.join(path.dirname(outputThumbnailPath), `${path.basename(outputThumbnailPath, path.extname(outputThumbnailPath))}.png`);

        await fs.rename(jpgOutputPath, newJpgPagePath);

        

        // Delete the intermediate PNG file
        await fs.unlink(newPngPagePath);
      } else {
        console.error('PNG page path is undefined');
      }
    } catch (error) {
      console.error('Error generating thumbnail:', error);
    }
  }


  async importFile(file: Express.Multer.File, grade_id: number) {
    const zip = new AdmZip(file.buffer);
    zip.extractAllTo('static', true);
    const zipEntries = zip.getEntries();
    let parent_id: null | number = null;
    let createSubject: Subject = null;
    let createTopic: Topic = null;
    let fileTypeFolder: File = null;
    let subTopicFolder: File = null;

    for (const item of zipEntries) {
      const entryName = item.entryName;
      const parts = entryName.split('/').filter(part => part !== '');
      if (parts.length === 1) {
        const checkExist = await this.subjectService.findOneBySubjectName(parts[0]);
        if (checkExist) {
          createSubject = checkExist;
        } else {
          createSubject = await this.subjectService.create({
            name: parts[0],
            grade_id: grade_id
          });
        }
      }
      if (parts.length === 2) {
        const checkExist = await this.topicService.findOneByTopicName(parts[1], createSubject.id);
        if (checkExist) {
          createTopic = checkExist;
        } else {
          createTopic = await this.topicService.create({
            name: parts[1],
            subjectId: createSubject.id
          })
        }
      }
      // console.log("parts", parts);
      console.log(parts);

      if (parts.length === 3) {
        //
        if (item.isDirectory) {
          const checkExist = await this.findOneFileNameByComponentFileType(parts[2], createTopic.id);
          const fileExtension = entryName.split('.').pop().toLowerCase();
          const filetype = this.getFileType(fileExtension);
          if (checkExist) {
            parent_id = checkExist.id;
            fileTypeFolder = checkExist;
          } else {

            let createFile = await this.create({
              isFolder:true,
              name: parts[2],
              filetype_id: 1,
              topic_id: createTopic.id
            })
            parent_id = createFile.id;
            fileTypeFolder = createFile;
          }
          if (filetype === 4) { // If it's a PDF file, create a thumbnail
            const pdfPath = path.join("static", entryName);
            const thumbnailPath = path.join("static/" + createSubject.name + "/" + createTopic.name, `${path.parse(entryName).name}-thumbnail.png`);
            try {
              await this.generateImageFromPdf(pdfPath, thumbnailPath);
            } catch (error) {
              console.error('Error generating thumbnail:', error);
            }
          }
        }
        else {
          const fileExtension = entryName.split('.').pop().toLowerCase();
          const checkExist = await this.findOneFileNameByComponentSubFolderAndFile(parts[3], parent_id);
          if (!checkExist) {
            const filetype = this.getFileType(fileExtension);
            await this.create({
              isFolder:true,
              name: parts[3],
              filetype_id: filetype,
              parent_id: createTopic.id,
              path: createSubject.name + "/" + createTopic.name + '/' + parts[2]
            })
          }
        }
      }
      if (parts.length === 4) {
        if (item.isDirectory) {
          const checkExist = await this.findOneFileNameByComponentSubFolderAndFile(parts[3], parent_id);
          if (checkExist) {
            parent_id = checkExist.id;
            subTopicFolder = checkExist;
          } else {
            let createFile = await this.create({
              isFolder:true,
              name: parts[3],
              filetype_id: 1,
              parent_id: fileTypeFolder.id
            })
            parent_id = createFile.id;
            subTopicFolder = createFile;
          }
        } else {
          const fileExtension = entryName.split('.').pop().toLowerCase();
          const checkExist = await this.findOneFileNameByComponentSubFolderAndFile(parts[3], parent_id);
          if (!checkExist) {
            const filetype = this.getFileType(fileExtension);
            await this.create({
              isFolder:true,
              name: parts[3],
              filetype_id: filetype,
              parent_id: fileTypeFolder.id,
              path: createSubject.name + "/" + createTopic.name + '/' + fileTypeFolder.name + '/' + parts[3]
            })
            if (filetype === 3) { // Nếu là file video, tạo ảnh thumbnail
              const videoPath = path.join("static", entryName);
              const thumbnailPath = path.join("static/" + createSubject.name + "/" + createTopic.name + '/' + fileTypeFolder.name, `${path.parse(entryName).name}-thumbnail.png`);
              try {
                await this.generateImageFromVideo(videoPath, thumbnailPath, '00:00:14');
              } catch (error) {
                console.error('Error generating thumbnail:', error);
              }
            }
            if (filetype === 4) { // If it's a PDF file, create a thumbnail
              const pdfPath = path.join("static", entryName);
              const thumbnailPath = path.join("static/" + createSubject.name + "/" + createTopic.name + '/' + fileTypeFolder.name, `${path.parse(entryName).name}-thumbnail.png`);
              try {
                await this.generateImageFromPdf(pdfPath, thumbnailPath);
              } catch (error) {
                console.error('Error generating thumbnail:', error);
              }
            }
          }
        }
      }
      if (parts.length === 5) {
        const fileExtension = entryName.split('.').pop().toLowerCase();
        const checkExist = await this.findOneFileNameByComponentSubFolderAndFile(parts[3], parent_id);
        if (!checkExist) {
          const filetype = this.getFileType(fileExtension);
          const pathVideo = createSubject.name + "/" + createTopic.name + '/' + fileTypeFolder.name + '/' + subTopicFolder.name + '/';
          await this.create({
              isFolder:true,
            name: parts[4],
            filetype_id: filetype,
            parent_id: subTopicFolder.id,
            path: pathVideo + parts[4]
          })
          if (filetype === 3) { // Nếu là file video, tạo ảnh thumbnail
            const videoPath = path.join(pathVideo, entryName);
            const thumbnailPath = path.join(pathVideo, `${path.parse(entryName).name}-thumbnail.png`);
            try {
              await this.generateImageFromVideo(videoPath, thumbnailPath, '00:00:14');
            } catch (error) {
              console.error('Error generating thumbnail:', error);
            }
          }
          if (filetype === 4) { // If it's a PDF file, create a thumbnail
            const pdfPath = path.join("static", entryName);
            const thumbnailPath = path.join("static/" + createSubject.name + "/" + createTopic.name + '/' + fileTypeFolder.name + '/' + subTopicFolder.name, `${path.parse(entryName).name}-thumbnail.png`);
            try {
              await this.generateImageFromPdf(pdfPath, thumbnailPath);
            } catch (error) {
              console.error('Error generating thumbnail:', error);
            }
          }
        }
      }
    }

    // const fileNames = zipEntries.map(entry => entry.entryName);
    // console.log(fileNames);
    // const fileType = this.repo.create(entity);
    // const fileTypeEntity = await this.repo.save(fileType);
    // return fileTypeEntity;
  }


  async findAll(pageOptions: PageOptionsDto, querys: Partial<File>): Promise<PageDto<File>> {
    const queryBuilder = this.repo.createQueryBuilder('file').where('file.status = :status', { status: 1 }).leftJoinAndSelect('file.images', 'image'); 
    if (!!querys && Object.keys(querys).length > 0) {
      const arrayQuery = difference(Object.keys(pageOptions), Object.keys(querys))
     arrayQuery.forEach((key) => {
        if (key !== undefined && key !== null ) {
          queryBuilder.andWhere(`file.${key} = :${key}`, { [key]: querys[key] });
          // queryBuilder.andWhere(`file.filetype_id = :${4}`);
        }
      });
    }

     if (pageOptions.search) {
      queryBuilder.andWhere('file.name LIKE :name', { name: `%${pageOptions.search}%` });
    }

    queryBuilder.orderBy("file.createdAt", pageOptions.order)
    .skip(pageOptions.skip)
      .take(pageOptions.take);
      
      const itemCount = await queryBuilder.getCount();
      const pageMetaDto = new PageMetaDto({pageOptionsDto:pageOptions, itemCount });
    const entities = await queryBuilder.getMany();
    
    for (let i = 0; i < entities.length; i++){
        const voices:Voice[] = await this.repoVoice.find({
            where: {
             fileId:entities[i].id
            }
        });
        (entities[i] as any).voices = voices;
      }

    return new PageDto(entities, pageMetaDto);
    
  }

  async findOne(id: number):Promise<ItemDto<File>>  {
    return  new ItemDto( await this.repo.findOne({
      where: {
        id: id,
        status:1
      },
      relations:['images']
    }));
  }

  async update(id: number, attrs: Partial<File>) {
    const fileType = await this.repo.findOne({
      where: {
        id: id,
        status:1
      }
    })
    if (!fileType) {
      throw new NotFoundException('fileType not found');
    }
    
    Object.assign(fileType, attrs);
    return this.repo.save(fileType);
  }

  async remove(id: number) {
    const file = await this.repo.findOne({
      where: {
        id: id,
        status:1
      },
      relations:['images']
    })
    console.log(file);
    
    if (!file) {
      throw new NotFoundException('file not found');
    }
   
    
    const remove = await this.repo.remove(file)
    console.log(remove);
    
    return remove;
  }



  findOneFileNameByComponentFileType(name: string, topic_id: number) {
    return this.repo.findOneBy({ name, topic_id });
  }
  findOneFileNameByComponentSubFolderAndFile(name: string, parent_id: number) {
    return this.repo.findOneBy({ name, parent_id });
  }

  getFileType(fileExtension: string): number {
    const extension = fileExtension.toLowerCase();
    if (['png', 'jpg', 'jpeg'].includes(extension)) {
      return 2; // Image file
    } else if (extension === 'mp4') {
      return 3; // Video file
    } else if (extension === 'pdf') {
      return 4; // PDF file
    }
    return 1; // Default file type
  }
  async generateImageFromVideo(videoPath: string, outputImagePath: string, time: string): Promise<void> {

    return new Promise((resolve, reject) => {
      ffmpeg(videoPath)
        .screenshots({
          timestamps: [time],
          filename: path.basename(outputImagePath), // Ensure only the filename is used, not the full path
          folder: path.dirname(outputImagePath),
        })
        .on('end', () => {
          console.log('Screenshot taken');
          resolve();
        })
        .on('error', (err: any) => {
          console.error('Error taking screenshot:', err);
          reject(err);
        });
    });
  }

  async generateImageFromVideo2(videoPath: string, outputImagePath: string, time: string): Promise<void> {
    console.log(path.basename(outputImagePath));
    console.log(path.dirname(outputImagePath));
    return new Promise((resolve, reject) => {
      ffmpeg(videoPath)
        .screenshots({
          timestamps: [time],
          filename: path.basename(outputImagePath), // Ensure only the filename is used, not the full path
          folder: path.dirname(outputImagePath),
        })
        .on('end', () => {
          console.log('Screenshot taken');
          resolve();
        })
        .on('error', (err: any) => {
          console.error('Error taking screenshot:', err);
          reject(err);
        });
    });
  }

  // async convertPdfToImages(pdfPath: string, outputDir: string): Promise<string[]> {
  // try {
  //   // const outputFiles: string[] = [];

  //   // Đảm bảo thư mục đầu ra tồn tại
  //   await fs.mkdir(outputDir, { recursive: true });
  //   const existingFiles = new Set(await fs.readdir(outputDir));

  //   // Thiết lập tùy chọn cho việc chuyển đổi
  //   const options = {
  //     format: 'png',
  //     out_dir: outputDir,
  //     out_prefix: path.basename(pdfPath, path.extname(pdfPath)),
  //     page: null, // Chuyển đổi tất cả các trang
  //   };
  //   // Chuyển đổi PDF thành hình ảnh
  //   await pdfPoppler.convert(pdfPath, options);
  //   // Lấy danh sách các tệp đã chuyển đổi
  //   const newFiles = await fs.readdir(outputDir);
  //   const outputFiles = newFiles.filter((file) => file.endsWith('.png') && !existingFiles.has(file)).map((file) => `images-convert/${file}`);
  //   return outputFiles;
  // } catch (error) {
  //   console.error('Error converting PDF to images:', error);
  //   throw new Error('Failed to convert PDF to images');
  // }
  // }

  async convertPdfToImages(pdfPath: string, outputDir: string): Promise<string[]> {
    try {
      await fs.mkdir(outputDir, { recursive: true });
      console.log(pdfPath);

      const pdfBuffer = await fs.readFile(pdfPath);
      const pdfData = await pdf(pdfBuffer);
      const totalPages = pdfData.numpages;

      const timestamp = Date.now();
      const options = {
        density: 100,
        saveFilename: "temp",
        savePath: outputDir,
        format: "png",
        width: 1000,
        height: 1000,
        quality: 100,
      };

      const convert = fromPath(pdfPath, options);
      const outputFiles: string[] = [];
      const publicPath = path.resolve(__dirname, '../../public/');

      for (let page = 1; page <= totalPages; page++) {
        const result = await convert(page, { responseType: "image" });

        const finalFilename = `${timestamp}_page${page}.png`;
        const finalPath = path.join(outputDir, finalFilename);

        await fs.rename(result.path, finalPath);

        // Chuáº©n hÃ³a path relative so vá»›i thÆ° má»¥c public
        const relativePath = path.relative(publicPath, finalPath).split(path.sep).join('/');
        outputFiles.push(relativePath);
      }

      console.log("PDF conversion completed.");
      return outputFiles;
    } catch (error) {
      console.error("Error converting PDF to images:", error);
      throw error;
    }
  }

  
  async resizeImage(buffer: Buffer, linkFile:string): Promise<string> {
    try {
       await sharp(buffer)
      .resize(800) // Thay đổi kích thước (nếu cần)
      .jpeg({ quality: 70 }) // Định dạng và chất lượng ảnh
      .toFile(linkFile);
    return linkFile;
    } catch (error) {
      console.log(error.message);
    }
  }
}
