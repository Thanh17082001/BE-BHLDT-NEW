import { AbstractEntity } from "src/utils/AbstractEntity";
import { Column, Entity } from "typeorm";
@Entity()
export class TypeLibrary extends AbstractEntity {
    @Column()
    name: string;
}
