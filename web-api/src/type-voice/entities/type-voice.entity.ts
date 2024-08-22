import { AbstractEntity } from "src/utils/AbstractEntity";
import { Column, Entity } from "typeorm";



@Entity()
export class TypeVoice extends AbstractEntity {
    @Column()
    name:string
}
