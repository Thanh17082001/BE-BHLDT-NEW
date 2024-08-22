import { AbstractEntity } from "src/utils/AbstractEntity";
import { Column, Entity } from "typeorm";

@Entity()
export class Score extends AbstractEntity {
    @Column()
    name: string;
    @Column("decimal", { precision: 5, scale: 2 })
    score: number;
    @Column("decimal", { precision: 5, scale: 2 })
    coefficient: number;
    @Column()
    studentId: number;
    @Column()
    schoolYearId: number;
    @Column()
    subjectId: number;
     @Column()
    classId: number;
     @Column({nullable:true})
    typeScoreId: number;

}
