import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateStudentDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    code: string;

    // profile
      @ApiProperty() 
    @IsString()
    email: string;
      @ApiProperty() 
    @IsString()
    fullname: string;
     @ApiProperty() 
    @IsString()
    gender: string;
      @ApiProperty()
    @IsString()
    phone: string;
      @ApiProperty()
    @IsString()
    street: string;
      @ApiProperty()
    @IsString()
      @ApiProperty()birthday: Date;

      @ApiProperty()
    @IsNumber()
    ward_id: number;
      @ApiProperty()
    @IsNumber()
    district_id: number;
      @ApiProperty()
    @IsNumber()
    province_id: number;


    //Class
    @ApiProperty()
    @IsNumber()
    classId: number;

    // //Account
    // @ApiProperty()
    // @IsNumber()
    // userId?: number;
}
