import { Expose, Exclude } from "class-transformer";

export class GradeDto {
    @Expose()
    id: number;
    @Expose()
    name: string;
}