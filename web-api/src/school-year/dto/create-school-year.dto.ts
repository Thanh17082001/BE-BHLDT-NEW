import { ApiProperty } from "@nestjs/swagger"
import { IsDate, IsNumber, IsString } from "class-validator"

export class CreateSchoolYearDto {
    @ApiProperty()
    @IsNumber()
    startYear: number
    @ApiProperty()
    @IsNumber()
    endYear: number
    // @ApiProperty()
    @IsString()
    name?:string = ''
}
