import { FileService } from './../file/file.service';
import { query } from 'express';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { Image } from './entities/image.entity';
import { File } from 'src/file/entities/file.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PageOptionsDto } from 'src/utils/dtos/pageoptions-dto';
import { PageDto } from 'src/utils/dtos/page-dto';
import { difference } from 'src/utils/differeceArray';
import { PageMetaDto } from 'src/utils/dtos/pagemeta-dto';

@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(Image) private repo: Repository<Image>,
    @InjectRepository(File) private readonly fileRepository: Repository<File>,
     private readonly fileService: FileService,
  ) {
  }
  async create(createImageDto: Partial<CreateImageDto>): Promise<Image> {
    const { name, fileId, path} = createImageDto;
    const file = await this.fileRepository.findOne({ where: { id: +fileId }, relations:['images'] });
    
   
    const cls = this.repo.create({ name, file, path });
    if (!file.images) {
      file.images = [];
    }
    file.images.push(cls)

    await this.fileService.update(file.id, file)
    return cls
  }

  async findAll(pageOptions: PageOptionsDto, queryImage: Partial<Image>): Promise<PageDto<Image>> {
    const queryBuilder = this.repo.createQueryBuilder('image').leftJoinAndSelect('image.file', 'file')
    if (!!queryImage && Object.keys(queryImage).length > 0) {
      const arrayQuery = difference(Object.keys(pageOptions), Object.keys(queryImage))
      console.log(arrayQuery);
      arrayQuery.forEach((key) => {
        if (key !== undefined && key !== null) {
          queryBuilder.andWhere(`image.${key} = :${key}`, { [key]: queryImage[key] });
        }
      });
    }
 if (pageOptions.search) {
      queryBuilder.andWhere('image.name LIKE :name', { name: `%${pageOptions.search}%` });
    }
    queryBuilder.orderBy("image.createdAt", pageOptions.order)
      .skip(pageOptions.skip)
      .take(pageOptions.take);

    const itemCount = await queryBuilder.getCount();
    const pageMetaDto = new PageMetaDto({ pageOptionsDto: pageOptions, itemCount });
    const entities = await queryBuilder.getMany();

    return new PageDto(entities, pageMetaDto);

  }


  async findOne(id: number): Promise<Image> {
    return this.repo.findOne({
      where: {
        id: id,
      },
      relations: ['file'],
    })
  }

  // async update(id: number, updateClassDto: Partial<UpdateClassDto>): Promise<Class> {
  //   const typeLib: Class = await this.findOne(id);
  //   const grade = await this.gradeRepository.findOne({ where: { id: +updateClassDto.gradeId } });
  //   const schoolYear = await this.schoolYearRepository.findOne({ where: { id: +updateClassDto.schoolYearId } });
  //   if (!typeLib) {
  //     throw new NotFoundException('user not found');
  //   }
  //   if (!grade) {
  //     throw new NotFoundException('grade not found');
  //   }
  //   if (!schoolYear) {
  //     throw new NotFoundException('schoolYear not found');
  //   }
  //   typeLib.schoolYear = schoolYear;
  //   typeLib.grade = grade;
  //   const data = this.repo.merge(
  //     typeLib,
  //     updateClassDto,
  //   );
  //   return await this.repo.save(data);
  // }

   async remove(id: number):Promise<Image> {
      const image = await this.repo.findOne({
      where: { id: id },
      });

    if (!image) {
      throw new NotFoundException(`Class with ID ${id} not found`);
     }
     const imageDel =  await this.repo.remove(image);
     const file = image.file
     const fileUpdate = await this.fileRepository.findOne({ where: { id: +file.id } });
     fileUpdate.images=[]
     this.fileRepository.save(fileUpdate)
    // Delete the image, related classes will be deleted automatically due to cascade
    return 
  }
}
