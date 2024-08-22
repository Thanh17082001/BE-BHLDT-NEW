import { AbstractEntity } from "src/utils/AbstractEntity";
import { Column, Entity } from "typeorm";

@Entity()
export class TypeQuestion extends AbstractEntity  {
    @Column({ unique: true })
    name: string;
    @Column({ unique: true })
    order: number;
}