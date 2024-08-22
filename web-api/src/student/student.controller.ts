import { Profile } from 'src/profile/entities/profile.entity';
import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors, UploadedFile, BadRequestException, Put } from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Student } from './entities/student.entity';
import { PageOptionsDto } from 'src/utils/dtos/pageoptions-dto';
import { ItemDto, PageDto } from 'src/utils/dtos/page-dto';
import { CreateProfileDto } from 'src/profile/dtos/create-profile.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import * as XLSX from 'xlsx';
import { ImportFileExcel } from './dto/excel.dto';
import * as moment from 'moment';
import { Province } from 'src/province/entities/supplier.entity';
import { ProvinceService } from 'src/province/province.service';
import { DistrictService } from 'src/district/district.service';
import { WardService } from 'src/ward/ward.service';
import { Ward } from 'src/ward/entities/ward.entity';
import { District } from 'src/district/entities/district.entity';
import { capitalizeWords } from 'src/utils/capitalizeWord';
import { QueryDto } from './dto/query';
import { PromotedDto } from 'src/score/dto/promoted-dto';
import { Promoted2Dto } from 'src/score/dto/promoted2-dto';
import { changeClassStudent } from './dto/change-class-student.dto';

@Controller('student')
@ApiTags('students')
export class StudentController {
  constructor(private readonly studentService: StudentService,
    private readonly provinceService: ProvinceService,
    private readonly districtService: DistrictService,
    private readonly wardService: WardService,
  ) {}

  @Post()
  async create(@Body() createStudentDto: CreateStudentDto) {
    try {
      const data = {
       classId:+createStudentDto.classId,
      }
      const dataProfile: CreateProfileDto = {
        code: createStudentDto.code,
        email:createStudentDto.email,
        fullname: createStudentDto.fullname,
        gender:createStudentDto.gender,
        phone: createStudentDto.phone,
        birthday: createStudentDto.birthday,
        province_id: createStudentDto.province_id,
        district_id: createStudentDto.district_id,
        ward_id: createStudentDto.ward_id,
        street:createStudentDto.street
      }
      return this.studentService.create(data,dataProfile);
    } catch (error) {
      console.log(error);
    }
  }

  @Post('import-excel')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFileExcel(@UploadedFile() file: Express.Multer.File,  @Body() importFileExcel: ImportFileExcel ) {
    try {
      const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);
      let students: Array<Student> = []
       let errors: Array<{ row: number, error: string }> = [];
    for (let i = 0; i < data.length; i++){
     try {
       const item = data[i];
      const valueItem = Object.values(item)
      const student: Partial<CreateStudentDto> = {
       
       classId:+importFileExcel.classId,
       }
      const ward:Ward = await this.wardService.findOneByWardName(capitalizeWords(valueItem[8]))
      const district:District = await this.districtService.findByName(capitalizeWords(valueItem[9]))
      const province :Province = await this.provinceService.findByName(capitalizeWords(valueItem[10]))

       const profile: CreateProfileDto = {
          code: valueItem[1],
         fullname: valueItem[2],
         gender: valueItem[3],
         birthday: moment(valueItem[4], 'DD/MM/YYYY').toDate(),
         phone: valueItem[5],
         email:valueItem[6],
         street:valueItem[7],
         ward_id: ward.id ? +ward.id : 0,
         district_id: district.id ? +district.id : 0,
         province_id:province.id ? +province.id : 0
      }
      const result = await this.studentService.create(student, profile);
      students.push(result)
     } catch (error) {
      //  console.log(error);
       errors.push({ row: i + 1, error: error.message });
     }

    }
    return {students, errors}
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  // @Get()
  // findAll(@Query() query: Partial<Student>, @Query() pageOptionDto: PageOptionsDto, ):Promise<PageDto<Student>> {
  //   return this.studentService.findAll(pageOptionDto,query);
  // }

  @Get()
  findAll(@Query() query: any, @Query() pageOptionDto: PageOptionsDto): Promise<PageDto<Student>> {
   const { schoolYearId, subjectId, typeScoreId, ...queryScore } = query;
    return this.studentService.findAll(pageOptionDto,queryScore, {schoolYearId, subjectId, typeScoreId,classId:queryScore.classId});
  }

  @Get(':id')
  async findOne(@Param('id') id: string):Promise<ItemDto<Student>> {
    return await this.studentService.findOne(+id)
  }

  @Put('/promoted-class')
  async promoted(@Body() update: Promoted2Dto): Promise<Array<Student>> {
    const { stundentIds, newClassId, oldSchoolYearId, newSchoolYearId, oldClassId } = update;
    const arrayResult= []
    for (let i = 0; i < stundentIds.length; i++) { 
      const data:PromotedDto = {
        stundentId: stundentIds[i],
        newClassId,
        oldSchoolYearId,
        newSchoolYearId,
        oldClassId
      }
      const result = await this.studentService.updateStudent(data)
      arrayResult.push(result)
    }
    
    return arrayResult
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto): Promise<Student> {
    try {
      const data = {
       classId:+updateStudentDto.classId || -1,
      }
      const dataProfile: CreateProfileDto = {
        code: updateStudentDto.code,
        fullname: updateStudentDto.fullname,
        email:updateStudentDto.email,
        gender:updateStudentDto.gender,
        phone: updateStudentDto.phone,
        birthday: updateStudentDto.birthday,
        province_id: +updateStudentDto.province_id,
        district_id: +updateStudentDto.district_id,
        ward_id: +updateStudentDto.ward_id,
        street:updateStudentDto.street
      }
    return this.studentService.update(+id, data, dataProfile);
    } catch (error) {
      return error.message
    }
  }

  @Patch('/change-class-student')
  async changeClassStudent(@Body() updateStudentDto: changeClassStudent):Promise<Student> {
    return this.studentService.changeClassStudent(+updateStudentDto.id, +updateStudentDto.classId);
  }


  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studentService.remove(+id);
  }
}