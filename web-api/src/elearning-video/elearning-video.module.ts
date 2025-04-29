import { Module } from '@nestjs/common';
import { ElearningVideoService } from './elearning-video.service';
import { ElearningVideoController } from './elearning-video.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ElearningVideo } from './entities/elearning-video.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ElearningVideo])],
  controllers: [ElearningVideoController],
  providers: [ElearningVideoService],
})
export class ElearningVideoModule {}
