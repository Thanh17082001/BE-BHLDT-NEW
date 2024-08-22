import { Exclude } from "class-transformer";
import { Grade } from "src/grade/entities/grade.entity";
import { Topic } from "src/topic/entities/topic.entity";
import { AbstractEntity } from "src/utils/AbstractEntity";
import { Entity, Column, PrimaryGeneratedColumn, Index, ManyToOne, JoinColumn, OneToMany } from "typeorm";
@Entity()
export class Subject extends AbstractEntity {
    @Column()
    name: string;
     @ManyToOne(() => Grade, grade => grade, { onDelete: 'SET NULL' })
    @JoinColumn()
    grade: Grade;
    @OneToMany(() => Topic, topic => topic.subject, { cascade: true, nullable:true , onDelete: 'CASCADE'})
    topics?: Topic[];
}
