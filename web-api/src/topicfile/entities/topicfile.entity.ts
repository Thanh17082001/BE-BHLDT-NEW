import { Exclude } from "class-transformer";
import { AbstractEntity } from "src/utils/AbstractEntity";
import { Entity, Column, PrimaryGeneratedColumn, Index } from "typeorm";
@Entity()
export class TopicFile extends AbstractEntity {
    @Column()
    @Index({ unique: true })
    name: string;
    @Column()
    topic_id: number;
}
