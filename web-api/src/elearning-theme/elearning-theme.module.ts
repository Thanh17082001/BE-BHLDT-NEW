import { Module } from '@nestjs/common';
import { ElearningThemeService } from './elearning-theme.service';
import { ElearningThemeController } from './elearning-theme.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ElearningTheme } from './entities/elearning-theme.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ElearningTheme])],
  exports: [ElearningThemeService],
  controllers: [ElearningThemeController],
  providers: [ElearningThemeService],
})
export class ElearningThemeModule {}
