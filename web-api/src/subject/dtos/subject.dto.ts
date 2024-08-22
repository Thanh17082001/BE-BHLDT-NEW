import { Expose, Exclude } from "class-transformer";

export class SubjectDto {
    @Expose()
    id: number;
    @Expose()
    name: string;
    @Expose()
    subject_id: number;
}