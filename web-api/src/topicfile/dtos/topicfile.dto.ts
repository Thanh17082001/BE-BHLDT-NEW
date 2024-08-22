import { Expose, Exclude } from "class-transformer";

export class TopicFileDto {
    @Expose()
    id: number;
    @Expose()
    name: string;
    @Expose()
    topic_id: string;
}