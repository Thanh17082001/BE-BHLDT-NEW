import { School } from "src/school/entities/school.entity";
import { AbstractEntity } from "src/utils/AbstractEntity";
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne } from "typeorm";

@Entity()
export class Position extends AbstractEntity {
    @Column()
    name: string;
    @ManyToOne(() => School, (school) => school)
    @JoinColumn()
    school: School;
 }
