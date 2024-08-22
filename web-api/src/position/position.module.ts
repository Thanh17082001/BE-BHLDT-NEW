import { Module } from '@nestjs/common';
import { PositionService } from './position.service';
import { PositionController } from './position.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Position } from './entities/position.entity';
import { SchoolModule } from 'src/school/school.module';

@Module({
  imports:[TypeOrmModule.forFeature([Position]), SchoolModule],
  controllers: [PositionController],
  providers: [PositionService],
})
export class PositionModule {}
