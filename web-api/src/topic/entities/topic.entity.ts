import { Exclude } from "class-transformer";
import { Grade } from "src/grade/entities/grade.entity";
import { Subject } from "src/subject/entities/subject.entity";
import { AbstractEntity } from "src/utils/AbstractEntity";
import { Entity, Column, PrimaryGeneratedColumn, Index, ManyToOne, JoinColumn } from "typeorm";
@Entity()
export class Topic extends AbstractEntity {
    @Column()
    name: string;
    @ManyToOne(() => Subject, subject => subject.topics, { onDelete: 'SET NULL' })
    @JoinColumn()
    subject: Subject;
}
