import { TypeQuestion } from './../../type-question/entities/type-question.entity';
import { AbstractEntity } from "src/utils/AbstractEntity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

@Entity()
export class Level extends AbstractEntity {
    @Column({unique:true})
    name: string;
    @Column({nullable:true})
    order: number;
    @ManyToOne(() => TypeQuestion, (typeQuestion) => typeQuestion)
    @JoinColumn()
    typeQuestion:TypeQuestion
}
