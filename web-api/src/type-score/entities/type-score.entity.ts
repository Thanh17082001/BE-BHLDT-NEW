import { AbstractEntity } from "src/utils/AbstractEntity";
import { Column, Entity } from "typeorm";

@Entity()
export class TypeScore extends AbstractEntity {
    @Column({ unique: true })
    name: string;
    @Column("decimal", { precision: 5, scale: 2 })
    coefficient:number
 }
