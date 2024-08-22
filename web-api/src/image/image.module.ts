import { forwardRef, Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { ImageController } from './image.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Image } from 'src/image/entities/image.entity';
import { FileModule } from 'src/file/file.module';

@Module({
  imports:[TypeOrmModule.forFeature([Image]), forwardRef(() => FileModule)],
  controllers: [ImageController],
  providers: [ImageService],
  exports:[TypeOrmModule, ImageService]
})
export class ImageModule {}
