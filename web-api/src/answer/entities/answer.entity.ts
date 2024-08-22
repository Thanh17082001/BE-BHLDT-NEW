import { Question } from "src/question/entities/question.entity";
import { AbstractEntity } from "src/utils/AbstractEntity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

@Entity()
export class Answer extends AbstractEntity {
    @Column()
    content: string;
    @ManyToOne(() => Question, question => question.answers, { onDelete: 'CASCADE' })
    @JoinColumn()
    question: Question;
     @Column()
    isCorrect: boolean;
 }
