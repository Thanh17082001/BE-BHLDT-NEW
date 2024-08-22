import { Module } from '@nestjs/common';
import { CovertFileService } from './covert-file.service';
import { CovertFileController } from './covert-file.controller';

@Module({
  controllers: [CovertFileController],
  providers: [CovertFileService],
  exports: [CovertFileService, ]
})
export class CovertFileModule {}
