import { Module } from '@nestjs/common';
import { ElearningService } from './elearning.service';
import { ElearningController } from './elearning.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Elearning } from './entities/elearning.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Elearning])], // Add your entities here
  controllers: [ElearningController],
  providers: [ElearningService],
})
export class ElearningModule {}
