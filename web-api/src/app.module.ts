import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'nestjs-pino';
import { join } from 'path';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { SupplierModule } from './supplier/supplier.module';
import { Supplier } from './supplier/entities/supplier.entity';
import { AuthModule } from './auth/auth.module';
import { Role } from './role/entities/role.entity';
import { RoleModule } from './role/role.module';
import { APP_GUARD } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { Profile } from './profile/entities/profile.entity';
import { Ward } from './ward/entities/ward.entity';
import { WardModule } from './ward/ward.module';
import { ProfileModule } from './profile/profile.module';
import { FileModule } from './file/file.module';
import { MulterModule } from '@nestjs/platform-express';
import { Grade } from './grade/entities/grade.entity';
import { Subject } from './subject/entities/subject.entity';
import { GradeModule } from './grade/grade.module';
import { SubjectModule } from './subject/subject.module';
import { TopicModule } from './topic/topic.module';
import { Topic } from './topic/entities/topic.entity';
import { FileType } from './filetype/entities/filetype.entity';
import { FileTypeModule } from './filetype/filetype.module';
import { File } from './file/entities/file.entity';
import { TypeLibraryModule } from './type-library/type-library.module';
import { SchoolModule } from './school/school.module';
import { BookModule } from './book/book.module';
import { LessonPlanModule } from './lesson-plan/lesson-plan.module';
import { PositionModule } from './position/position.module';
import { ProvinceModule } from './province/province.module';
import { DistrictModule } from './district/district.module';
import { LibraryModule } from './library/library.module';
import { ClassModule } from './class/class.module';
import { CovertFileModule } from './covert-file/covert-file.module';
import { StudentModule } from './student/student.module';
import { ScoreModule } from './score/score.module';
import { SchoolYearModule } from './school-year/school-year.module';
import { GradeService } from './grade/grade.service';
import { SubjectService } from './subject/subject.service';
import { ImageModule } from './image/image.module';
import { LevelModule } from './level/level.module';
import { TypeQuestionModule } from './type-question/type-question.module';
import { TypeScoreModule } from './type-score/type-score.module';
import { QuestionModule } from './question/question.module';
import { AnswerModule } from './answer/answer.module';
import { VoiceModule } from './voice/voice.module';
import { TypeVoiceModule } from './type-voice/type-voice.module';
import { TypeVoice } from './type-voice/entities/type-voice.entity';
import { ExamModule } from './exam/exam.module';
import { GameModule } from './game/game.module';
import { GameQuestionModule } from './game-question/game-question.module';
import { PartModule } from './part/part.module';
import { ElearningModule } from './elearning/elearning.module';
import { ElearningVideoModule } from './elearning-video/elearning-video.module';
import { ElearningThemeModule } from './elearning-theme/elearning-theme.module';

@Module({
  imports: [
   
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'static'),
    }),

    MulterModule.register({
      dest: join(__dirname, '..', 'static'), // Đặt thư mục đích là 'client'
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: '../db/gdschool44.db.sqlite',
      entities: [],
      synchronize: true, // only for development
      autoLoadEntities:true
    }),
    UserModule,
    SupplierModule,
    AuthModule,
    RoleModule,
    WardModule,
    ProfileModule,
    FileModule,
    GradeModule,
    SubjectModule,
    TopicModule,
    FileTypeModule,
    ProvinceModule,
    DistrictModule,
    FileModule,
    TypeLibraryModule,
    SchoolModule,
    BookModule,
    LessonPlanModule,
    PositionModule,
    LibraryModule,
    ClassModule,
    CovertFileModule,
    StudentModule,
    HttpModule,
    TypeScoreModule,
    SchoolYearModule,
    ImageModule,
    LevelModule,
    TypeQuestionModule,
    ScoreModule,
    QuestionModule,
    AnswerModule,
    VoiceModule,
    TypeVoiceModule,
    ExamModule,
    GameModule,
    GameQuestionModule,
    PartModule,
    ElearningModule,
    ElearningVideoModule,
    ElearningThemeModule
  ],
  controllers: [AppController],
  providers: [AppService],
  exports:[]
})
export class AppModule { }