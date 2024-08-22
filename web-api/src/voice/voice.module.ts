import { Module } from '@nestjs/common';
import { VoiceService } from './voice.service';
import { VoiceController } from './voice.controller';
import { TypeORMError } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Voice } from './entities/voice.entity';
import { TypeVoiceModule } from 'src/type-voice/type-voice.module';

@Module({
  imports:[TypeOrmModule.forFeature([Voice]), TypeVoiceModule],
  controllers: [VoiceController],
  providers: [VoiceService],
  exports:[TypeOrmModule]
})
export class VoiceModule {}
