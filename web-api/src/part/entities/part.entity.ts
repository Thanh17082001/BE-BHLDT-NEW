import { AbstractEntity } from "src/utils/AbstractEntity";
import { Column, Entity } from "typeorm";

@Entity()
export class Part extends AbstractEntity {
    @Column()
    name: string;

    @Column()
    order: number;
}
