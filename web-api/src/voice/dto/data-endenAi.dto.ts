import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsString } from "class-validator";
enum TypeVoice{
    'en-US',
    'en-UK',
}

enum Speaker{
    'FEMALE',
    'MALE'
}
export class EdenAiDto {
    @ApiProperty({ example: 'microsoft' })
    @IsString()
    providers: string= 'microsoft';

    @ApiPropertyOptional({
    example: 'en-UK',
    enum: TypeVoice,
    default: TypeVoice["en-US"],
    description: 'Language option'
  })
  @IsEnum(TypeVoice)
  @IsOptional()
    language: TypeVoice;

    @ApiProperty()
    @IsString()
        
    text: string='';

    @ApiPropertyOptional({
      example: 'FEMALE',
    enum: Speaker,
    default: Speaker.FEMALE,
    description: 'Speaker option'
  })
  @IsEnum(Speaker)
  @IsOptional()
    option: Speaker;

}