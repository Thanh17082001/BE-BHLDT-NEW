import { Expose, Exclude } from "class-transformer";

export class TopicDto {
    @Expose()
    id: number;
    @Expose()
    name: string;
    @Expose()
    subjectId: string;
}