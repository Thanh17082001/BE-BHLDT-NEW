import { Answer } from "src/answer/entities/answer.entity";
import { AbstractEntity } from "src/utils/AbstractEntity";
import { Column, Entity, JoinColumn, OneToMany } from "typeorm";

@Entity()
export class Question extends AbstractEntity {
    @Column()
    content: string;
    @Column()
    subjectId: number;
    @Column({ nullable: true })
    partId: number;
     @Column()
    topicId: number;
     @Column()
    typeQuestionId: number;
      @Column({nullable:true})
    numberOfAnswers: number;
     @Column()
    levelId: number;
     @Column("decimal", { precision: 5, scale: 2 })
    score: number;

  @OneToMany(() => Answer, answer => answer.question, { cascade: true, onDelete: 'CASCADE' })
    answers: Answer[];
 }
