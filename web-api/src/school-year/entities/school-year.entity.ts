import { AbstractEntity } from "src/utils/AbstractEntity";
import { Column, Entity } from "typeorm";

@Entity()

export class SchoolYear extends AbstractEntity {
    @Column()
    name: string
    @Column()
    startYear: number
    @Column()
    endYear: number
 }
