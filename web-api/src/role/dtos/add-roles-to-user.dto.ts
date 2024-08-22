import { IsNumber, IsArray, ValidateNested, IsInt } from 'class-validator'
import { Type } from 'class-transformer';
export class AddRolesToUser {
    @IsNumber()
    userId: number;
    @IsArray()
    @IsInt({ each: true })
    @Type(() => Number) // Ensure each item is treated as a number
    roles: number[]
}
