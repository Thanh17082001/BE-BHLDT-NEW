import { Question } from "src/question/entities/question.entity";
import { AbstractEntity } from "src/utils/AbstractEntity";
import { Column, Entity, JoinTable, ManyToMany } from "typeorm";

@Entity()
export class Exam extends AbstractEntity {
    @Column()
    name: string;
    @Column()
    subjectId: number;
    @Column()
    time: number;
    @Column()
    subExam: number;
    @Column()
    totalMultipleChoiceScore: number;
    @Column()
    totalEssayScore: number;
    @ManyToMany(() => Question)
    @JoinTable()
    questions: Question[];
}
