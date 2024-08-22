import { Grade } from "src/grade/entities/grade.entity";
import { AbstractEntity } from "src/utils/AbstractEntity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany } from "typeorm";

@Entity()
export class School extends AbstractEntity {
    @Column()
        code:string
    @Column()
    name: string;
     @Column()
    address: string;
     @Column()
    description: string;
    @Column({ nullable: true })
    manageBy:string

    @OneToMany(() => Grade, grade => grade.school, { cascade: true , onDelete: 'CASCADE'})
    grades: Grade[];
}
