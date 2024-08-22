import { forwardRef, Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { ClassModule } from 'src/class/class.module';
import { UserModule } from 'src/user/user.module';
import { ProfileModule } from 'src/profile/profile.module';
import { ProvinceModule } from 'src/province/province.module';
import { DistrictModule } from 'src/district/district.module';
import { WardModule } from 'src/ward/ward.module';
import { ScoreModule } from 'src/score/score.module';
import { TypeScoreModule } from 'src/type-score/type-score.module';

@Module({
  imports:[TypeOrmModule.forFeature([Student]), ClassModule,TypeScoreModule, UserModule, ProfileModule, ProvinceModule, DistrictModule, WardModule, forwardRef(() => ScoreModule)],
  controllers: [StudentController],
  providers: [StudentService],
  exports:[TypeOrmModule, StudentService]
})
export class StudentModule {}
